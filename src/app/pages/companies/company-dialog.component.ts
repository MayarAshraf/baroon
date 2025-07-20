import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
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
import { CompanyModel } from './services/service-type';

@Component({
  selector: 'app-company-dialog',
  standalone: true,
  templateUrl:
    '/src/app/shared/components/basic-crud/base-create-update/base-create-update.component.html',
  imports: [
    AsyncPipe,
    TranslateModule,
    ButtonModule,
    RouterLink,
    SpinnerComponent,
    FormComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyDialogComponent extends BaseCreateUpdateComponent<CompanyModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #languages = inject(StaticDataService).languages;

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: 'sister_companies',
        update: 'sister_companies/update',
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Update Sister Company')),
        submitButtonLabel: this.translate.instant(_('Update Sister Company')),
      };
      this.model = new CompanyModel(this.editData);
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Create Sister Company')),
        submitButtonLabel: this.translate.instant(_('Create Sister Company')),
      };
    }
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
      {
        key: 'logo',
        type: 'file-field',
        props: {
          label: _(`logo`),
          description: this.translate.instant(
            _('Allowed format is jpeg, jpg, png'),
          ),
        },
      },
    ];
  }

  #BuildLangFields(lang: string): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: `name_${lang}`,
          type: 'floated-input-field',
          props: {
            required: lang === 'en',
            label: _(`name`),
            placeholder: _(`name`),
          },
        },
        {
          key: `description_${lang}`,
          type: 'textarea-field',
          className: 'col-12',
          props: {
            label: _('description'),
          },
        },
      ]),
    ];
  }
}
