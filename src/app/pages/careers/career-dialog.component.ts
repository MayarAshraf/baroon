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
import { Career, CareerModel } from './services/service-type';

@Component({
  selector: 'app-career-dialog',
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
export class CareerDialogComponent extends BaseCreateUpdateComponent<CareerModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #languages = inject(StaticDataService).languages;
  #staticData = inject(StaticDataService);
  #slugField = inject(SlugInputService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: 'careers/careers',
        update: 'careers/careers/update',
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Update Careers')),
        submitButtonLabel: this.translate.instant(_('Update Careers')),
      };
      this.model = new CareerModel(this.editData);
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Create Careers')),
        submitButtonLabel: this.translate.instant(_('Create Careers')),
      };
      this.model = new CareerModel();
    }
    this.fields = this.configureFields();
  }

  protected override updateModel() {
    const formValue = this.createUpdateForm.value as Career;

    const salaryRange: [number, number] = [
      formValue.min_salary,
      formValue.max_salary,
    ];

    return {
      ...this.model,
      salary_range: salaryRange,
    };
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
          key: 'type',
          type: 'select-field',
          props: {
            required: true,
            isFloatedLabel: true,
            label: _('Select type'),
            placeholder: _('Select type'),
            options: this.#staticData.typeCareer,
          },
        },
      ]),

      {
        key: 'show_salary',
        type: 'switch-field',
        className: 'col-12',
        props: {
          trueValue: 1,
          falseValue: 0,
          label: _(`show salary`),
        },
      },

      {
        fieldGroup: [
          this.#fieldBuilder.fieldBuilder([
            {
              key: 'min_salary',
              type: 'floated-input-field',
              props: {
                label: _('Minimum Salary'),
                type: 'number',
                min: 0,
              },
            },
            {
              key: 'max_salary',
              type: 'floated-input-field',
              props: {
                label: _('Maximum Salary'),
                type: 'number',
                min: 0,
              },
            },
          ]),
        ],
      },
      this.#fieldBuilder.fieldBuilder([
        {
          key: 'number_of_available_vacancies',
          type: 'floated-input-field',
          props: {
            label: _('number vacancies'),
            type: 'number',
            required: true,
          },
        },
        {
          key: 'closed_at',
          type: 'date-field',
          props: {
            showTime: true,
            required: true,
            hourFormat: '12',
            label: _('closed at'),
          },
        },
      ]),
      {
        fieldGroup: [
          {
            template: `<div class="border-1 border-200 mb-3"></div>`,
          },
          ...this.#buildSeoLangFields(),
        ],
      },
    ];
  }

  #seoFields(lang?: string): FormlyFieldConfig[] {
    return [
      {
        key: `meta_description_${lang}`,
        type: 'textarea-field',
        className: 'col-6',
        props: {
          label: _(`meta description`),
          placeholder: _(`meta description`),
        },
      },
      {
        key: `meta_title_${lang}`,
        type: 'floated-input-field',
        props: {
          label: _(`meta title`),
          placeholder: _(`meta title`),
        },
      },
    ];
  }

  #buildSeoLangFields(): FormlyFieldConfig[] {
    return [
      {
        fieldGroup: [
          {
            type: 'accordion-field',
            fieldGroup: [
              {
                props: {
                  header: _(`SEO`),
                  selected: this.editData,
                },
                fieldGroup: [
                  {
                    type: 'tabs-field',
                    fieldGroup: this.#languages.map((lang) => ({
                      props: {
                        label: `${lang.label} (${lang.value.toUpperCase()})`,
                      },
                      fieldGroup: this.#seoFields(lang.value),
                    })),
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  }

  #BuildLangFields(lang: string): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: `title_${lang}`,
          type: 'floated-input-field',
          props: {
            label: _(`title`),
            required: lang === 'en',
            placeholder: _(`title`),
          },
        },
        {
          key: `description_${lang}`,
          type: 'editor-field',
          className: 'col-12',
          props: {
            label: _(`description`),
            required: lang === 'en',
            placeholder: _(`description`),
          },
        },
      ]),
    ];
  }
}
