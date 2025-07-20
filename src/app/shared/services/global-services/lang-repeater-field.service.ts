import { Injectable, inject } from '@angular/core';
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from '@ngx-formly/core';
import { startWith, tap } from 'rxjs';
import { FieldBuilderService } from '../forms/field-builder.service';
import { StaticDataService } from '../general-data/static-data.service';

@Injectable({
  providedIn: 'root'
})
export class LangRepeaterFieldService {
  #staticDataService = inject(StaticDataService);
  #fieldBuilder = inject(FieldBuilderService);

  getlangRepeaterField(fields: FormlyFieldConfig[] = [], options = {} as { [key: string]: any }, modelCallback?: (field: FormlyFieldConfig) => void): FormlyFieldConfig {
    return {
      key: "trans",
      type: 'repeat-field',
      props: {
        addBtnText: _("Add Translation"),
        disabledRepeater: false,
        ...options
      },
      hooks: {
        onInit: (field: FormlyFieldConfig) => {
          modelCallback?.(field);
          return field.formControl?.valueChanges.pipe(
            startWith(field.model),
            tap(langs => {

              const firstLangField = field?.parent?.get?.("trans")?.fieldGroup?.[0].get?.("language_code");
              firstLangField?.props && (firstLangField.props.disabled = true);

              const LangFields = field?.parent?.get?.("trans")?.fieldGroup?.slice(1);
              LangFields?.forEach((field) => {
                const fields = field.get?.("language_code");
                fields?.props && (fields.props.options = this.#staticDataService.languages.slice(1));
              })
              if (!field.props) return;

              if (langs.length === this.#staticDataService.languages.length) {
                return field.props.disabledRepeater = true;
              } else {
                return field.props.disabledRepeater = false
              }
            })
          )
        }
      },
      fieldArray: this.#fieldBuilder.fieldBuilder([
        {
          key: "language_code",
          type: "select-field",
          props: {
            required: true,
            isFloatedLabel: true,
            label: _("Languages"),
            options: this.#staticDataService.languages,
            optionValue: "value",
            optionLabel: "label"
          },
        },
        ...fields
      ])
    };
  };
}
