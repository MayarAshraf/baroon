import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { SlugInputService } from '@gService/slug-input.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  BaseCreateUpdateComponent,
  FieldBuilderService,
  FormComponent,
  SpinnerComponent,
  StaticDataService,
} from '@shared';
import { ButtonModule } from 'primeng/button';
import { lookupModel } from './services/service-type';

@Component({
  selector: 'app-lookups-dialog',
  standalone: true,
  imports: [
    AsyncPipe,
    TranslateModule,
    RouterLink,
    ButtonModule,
    SpinnerComponent,
    FormComponent,
  ],
  templateUrl:
    '/src/app/shared/components/basic-crud/base-create-update/base-create-update.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LookupsDialogComponent extends BaseCreateUpdateComponent<lookupModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #languages = inject(StaticDataService).languages;
  #slugField = inject(SlugInputService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: 'lookups/lookup',
        update: 'lookups/lookup/update',
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Update lookups')),
        submitButtonLabel: this.translate.instant(_('Update lookups')),
      };
      this.model = new lookupModel(this.editData);
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Create lookups')),
        submitButtonLabel: this.translate.instant(_('Create lookups')),
      };
    }
    this.#updateFields();
  }

  #updateFields() {
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        type: 'tabs-field',
        fieldGroup: this.#languages.map((lang) => ({
          props: {
            label: `${lang.label} (${lang.value.toUpperCase()})`,
          },
          fieldGroup: this.#BuildLangFields(lang.value),
        })),
      },
      this.#fieldBuilder.fieldBuilder([
        {
          key: 'order',
          type: 'floated-input-field',
          props: {
            type: 'number',
            label: _('order'),
            min: 0,
          },
        },
        this.#slugField.getSlugField(),
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: 'is_active',
          type: 'switch-field',
          props: {
            label: _(`Active`),
            trueValue: 1,
            falseValue: 0,
          },
        },
        {
          key: 'is_editable',
          type: 'switch-field',
          props: {
            label: _(`Editable`),
            trueValue: 1,
            falseValue: 0,
          },
        },
      ]),
    ];
  }

  #BuildLangFields(lang: string): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: `name_${lang}`,
          type: 'floated-input-field',
          props: {
            label: _(`name`),
            required: lang === 'en',
            placeholder: _(`name`),
          },
        },
      ]),
    ];
  }
}
