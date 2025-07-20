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
import { ApplicantModel } from './services/service-type';

@Component({
  selector: 'app-applicants-dialog',
  standalone: true,
  templateUrl:
    '/src/app/shared/components/basic-crud/base-create-update/base-create-update.component.html',
  imports: [
    AsyncPipe,
    TranslateModule,
    RouterLink,
    ButtonModule,
    SpinnerComponent,
    FormComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicantDialogComponent extends BaseCreateUpdateComponent<ApplicantModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #languages = inject(StaticDataService).languages;
  #slugField = inject(SlugInputService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: 'careers/applicants',
        update: 'careers/applicants/update',
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Update Applicants')),
        submitButtonLabel: this.translate.instant(_('Update Applicants')),
      };
      this.model = new ApplicantModel(this.editData);
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Create Applicants')),
        submitButtonLabel: this.translate.instant(_('Create Applicants')),
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
        this.#slugField.getSlugField(),
        {
          key: 'phone',
          type: 'floated-input-field',
          props: {
            required: true,
            type: 'number',
            label: _('phone'),
            min: 0,
          },
          validators: {
            validation: ['phone'],
          },
        },
        {
          key: `email`,
          type: 'floated-input-field',
          props: {
            required: true,
            label: _(`email`),
            placeholder: _(`email`),
          },
          validators: {
            validation: ['email'],
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: 'careers',
          type: 'autocomplete-field',
          props: {
            required: true,
            placeholder: _('Select Carrer'),
            endpoint: `careers-list`,
            fieldKey: 'career_id',
          },
        },
        {
          key: 'status',
          type: 'select-field',
          props: {
            isFloatedLabel: true,
            label: _('status'),
            required: true,
            options: [
              { label: this.translate.instant(_('Pending')), value: 'Pending' },
              {
                label: this.translate.instant(_('Accepted')),
                value: 'Accepted',
              },
              {
                label: this.translate.instant(_('Rejected')),
                value: 'Rejected',
              },
            ],
          },
        },
      ]),
      {
        key: 'attachments',
        type: 'file-field',
        props: {
          multiple: true,
          label: _(`attachments`),
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
      ]),
    ];
  }
}
