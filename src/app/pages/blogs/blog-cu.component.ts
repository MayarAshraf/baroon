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
import { BlogModel } from './services/service-types';

@Component({
  selector: 'app-blog-cu',
  templateUrl:
    '/src/app/shared/components/basic-crud/base-create-update/base-create-update.component.html',
  standalone: true,
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
export class BlogCuComponent extends BaseCreateUpdateComponent<BlogModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #staticData = inject(StaticDataService);
  #slugField = inject(SlugInputService);
  #languages = inject(StaticDataService).languages;

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: 'blogs/blog',
        update: 'blogs/blog/update',
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Update Blog')),
        submitButtonLabel: this.translate.instant(_(`Update blog`)),
      };
      this.model = new BlogModel(this.editData);
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Create blog')),
        submitButtonLabel: this.translate.instant(_(`Create blog`)),
      };

      this.model = new BlogModel();
    }
    this.fields = this.configureFields();
  }
  configureFields(): FormlyFieldConfig[] {
    return [
      {
        fieldGroupClassName: 'grid formgrid grid-nogutter',
        fieldGroup: [
          {
            className:
              'col-12 xl:col-2 lg:col-3 md:col-4 bg-gray-100 px-3 pt-4',
            fieldGroup: [
              {
                key: 'is_published',
                type: 'switch-field',
                className: 'col-6',
                props: {
                  trueValue: 1,
                  falseValue: 0,
                  label: _(`is published`),
                },
              },
              {
                key: 'is_featured',
                type: 'switch-field',
                className: 'col-6',
                props: {
                  trueValue: 1,
                  falseValue: 0,
                  label: _(`is featured`),
                },
              },
            ],
          },
          {
            className: 'col-12 xl:col-10 lg:col-9 md:col-8 px-3 pt-4',
            fieldGroup: [
              {
                type: 'tabs-field',
                fieldGroup: this.#staticData.languages.map((lang) => ({
                  fieldGroupClassName: 'grid formgrid grid-nogutter',
                  props: { label: `(${lang.value.toUpperCase()})` },
                  fieldGroup: this.#BuildLangFields(lang.value),
                })),
              },
              this.#fieldBuilder.fieldBuilder([
                {
                  key: 'order',
                  type: 'floated-input-field',
                  props: {
                    type: 'number',
                    label: _('Order'),
                    min: 0,
                  },
                },
                this.#slugField.getSlugField(),
                {
                  key: 'start_date',
                  type: 'date-field',
                  props: {
                    label: _('start date'),
                  },
                },
                {
                  key: 'end_date',
                  type: 'date-field',
                  props: {
                    label: _('end date'),
                  },
                },
              ]),
              this.#fieldBuilder.fieldBuilder([
                {
                  key: `views`,
                  type: 'floated-input-field',
                  props: {
                    type: 'number',
                    required: true,
                    label: _('views'),
                  },
                },
                {
                  key: 'media_type',
                  type: 'select-field',
                  props: {
                    required: true,
                    isFloatedLabel: true,
                    label: _('select media type'),
                    placeholder: _('select media type'),
                    options: [
                      {
                        label: _('image'),
                        value: 'image',
                      },
                      {
                        label: _('video'),
                        value: 'video',
                      },
                    ],
                  },
                },
              ]),
              this.#fieldBuilder.fieldBuilder([
                {
                  key: 'image',
                  type: 'file-field',
                  expressions: {
                    hide: (field) =>
                      field.form?.get('media_type')?.value !== 'image',
                  },
                  props: {
                    chooseLabel: _('Image'),
                  },
                },
              ]),
              this.#fieldBuilder.fieldBuilder([
                {
                  key: `video_type`,
                  type: 'select-field',
                  expressions: {
                    hide: (field) =>
                      field.form?.get('media_type')?.value !== 'video',
                  },
                  props: {
                    required: true,
                    isFloatedLabel: true,
                    label: _('video type'),
                    placeholder: _('select media type'),
                    options: [
                      {
                        label: _('url'),
                        value: 'url',
                      },
                      {
                        label: _('iframe'),
                        value: 'iframe',
                      },
                    ],
                  },
                },
                {
                  key: 'video',
                  type: 'textarea-field',
                  className:"col-12",
                  expressions: {
                    hide: (field) =>
                      field.form?.get('video_type')?.value !== 'iframe',
                  },
                  props: {
                    required: true,
                    label: _('video'),
                  },
                },
                {
                  key: 'video',
                  type: 'floated-input-field',
                  expressions: {
                    hide: (field) =>
                      field.form?.get('video_type')?.value !== 'url',
                  },
                  props: {
                    required: true,
                    label: _('video'),
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
            ],
          },
        ],
      },
    ];
  }

  #seoFields(lang?: string): FormlyFieldConfig[] {
    return [
      {
        key: `meta_description_${lang}`,
        type: 'textarea-field',
        props: {
          label: _(`meta description`),
          placeholder: _(`meta description`),
        },
      },
      {
        key: `meta_title_${lang}`,
        type: 'floated-input-field',
        props: {
          label: _('meta title'),
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
      {
        fieldGroup: [
          this.#fieldBuilder.fieldBuilder([
            {
              key: `title_${lang}`,
              type: 'floated-input-field',
              props: {
                required: lang === 'en',
                label: _('Title'),
              },
            },
            {
              key: `sub_title_${lang}`,
              type: 'floated-input-field',
              props: {
                label: _('Subtitle'),
              },
            },
          ]),
          {
            key: `short_description_${lang}`,
            type: 'textarea',
            props: {
              label: _('short description'),
            },
          },
          {
            key: `description_${lang}`,
            type: 'editor-field',
            props: {
              required: lang === 'en',
              label: _('description'),
            },
          },
        ],
      },
    ];
  }
}
