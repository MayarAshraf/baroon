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
import { serialize } from 'object-to-formdata';
import { ButtonModule } from 'primeng/button';
import { GeneralSettingModel } from './services/service-type';

@Component({
  selector: 'app-general-setting-cu',
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
export class GeneralSettingCuComponent extends BaseCreateUpdateComponent<GeneralSettingModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #languages = inject(StaticDataService).languages;
  #slugField = inject(SlugInputService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: 'settings/general-settings',
        update: 'settings/general-settings/update',
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Update Setting')),
        submitButtonLabel: this.translate.instant(_('Update')),
      };
      this.model = new GeneralSettingModel(this.editData);
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Create Setting')),
        submitButtonLabel: this.translate.instant(_('Create')),
      };
      this.model = new GeneralSettingModel();
    }
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    if (this.editData) {
      switch (this.editData.slug) {
        case 'about-kayan':
          return [
            {
              type: 'tabs-field',
              fieldGroup: this.#languages.map((lang) => ({
                props: {
                  label: `${lang.label} (${lang.value.toUpperCase()})`,
                },
                fieldGroup: [
                  this.#fieldBuilder.fieldBuilder(this.description(lang.value)),
                ],
              })),
            },
          ];
        case 'mission':
          return [
            {
              type: 'tabs-field',
              fieldGroup: this.#languages.map((lang) => ({
                props: {
                  label: `${lang.label} (${lang.value.toUpperCase()})`,
                },
                fieldGroup: [
                  this.#fieldBuilder.fieldBuilder(this.description(lang.value)),
                ],
              })),
            },
          ];
        case 'vision':
          return [
            {
              type: 'tabs-field',
              fieldGroup: this.#languages.map((lang) => ({
                props: {
                  label: `${lang.label} (${lang.value.toUpperCase()})`,
                },
                fieldGroup: [
                  this.#fieldBuilder.fieldBuilder(this.description(lang.value)),
                ],
              })),
            },
          ];
        case 'footer-address':
          return [
            {
              type: 'tabs-field',
              fieldGroup: this.#languages.map((lang) => ({
                props: {
                  label: `${lang.label} (${lang.value.toUpperCase()})`,
                },
                fieldGroup: [
                  this.#fieldBuilder.fieldBuilder(this.description(lang.value)),
                ],
              })),
            },
          ];
        case 'contact-address':
          return [
            {
              type: 'tabs-field',
              fieldGroup: this.#languages.map((lang) => ({
                props: {
                  label: `${lang.label} (${lang.value.toUpperCase()})`,
                },
                fieldGroup: [
                  this.#fieldBuilder.fieldBuilder(this.description(lang.value)),
                ],
              })),
            },
          ];
        case 'header-whatsapp':
          return [
            this.#fieldBuilder.fieldBuilder(this.title('en')),
            {
              fieldGroup: [
                this.#fieldBuilder.fieldBuilder(this.linkMultiLang()),
              ],
            },
          ];
        case 'header-phone':
          return [
            this.#fieldBuilder.fieldBuilder(this.title('en')),
            {
              fieldGroup: [
                this.#fieldBuilder.fieldBuilder(this.linkMultiLang()),
              ],
            },
          ];
        case 'header-email':
          return [
            this.#fieldBuilder.fieldBuilder(this.title('en')),
            {
              fieldGroup: [
                this.#fieldBuilder.fieldBuilder(this.linkMultiLang()),
              ],
            },
          ];
        case 'contact-phone':
          return [
            this.#fieldBuilder.fieldBuilder(this.title('en')),
            {
              fieldGroup: [
                this.#fieldBuilder.fieldBuilder(this.linkMultiLang()),
              ],
            },
          ];
        case 'contact-email':
          return [
            this.#fieldBuilder.fieldBuilder(this.title('en')),
            {
              fieldGroup: [
                this.#fieldBuilder.fieldBuilder(this.linkMultiLang()),
              ],
            },
          ];
        case 'footer-phone':
          return [
            this.#fieldBuilder.fieldBuilder(this.title('en')),
            {
              fieldGroup: [
                this.#fieldBuilder.fieldBuilder(this.linkMultiLang()),
              ],
            },
          ];
        case 'facebook-link':
          return [
            {
              fieldGroup: [this.#fieldBuilder.fieldBuilder(this.link('en'))],
            },
          ];
        case 'linkedin-link':
          return [
            {
              fieldGroup: [this.#fieldBuilder.fieldBuilder(this.link('en'))],
            },
          ];
        case 'tiktok-link':
          return [
            {
              fieldGroup: [this.#fieldBuilder.fieldBuilder(this.link('en'))],
            },
          ];
        case 'youtube-link':
          return [
            {
              fieldGroup: [this.#fieldBuilder.fieldBuilder(this.link('en'))],
            },
          ];
        case 'instagram-link':
          return [
            {
              fieldGroup: [this.#fieldBuilder.fieldBuilder(this.link('en'))],
            },
          ];
        case 'snapchat-link':
          return [
            {
              fieldGroup: [this.#fieldBuilder.fieldBuilder(this.link('en'))],
            },
          ];
        case 'about-background':
          return [
            {
              fieldGroup: [
                this.#fieldBuilder.fieldBuilder(this.featuredImageField()),
              ],
            },
          ];
        default:
          return this.allFields();
      }
    } else {
      return this.allFields();
    }
  }

  override createUpdateRecord(endpoints: { [key: string]: string }) {
    let model = { ...this.updateModel(), _method: 'POST' };

    if (this.editData && this.editData.method !== 'create') {
      delete this.updateModel().screen_shot;
      model = { ...this.updateModel(), _method: 'PUT' };
    }

    this.formData = serialize<GeneralSettingModel>(model, {
      indices: true,
      allowEmptyArrays: false,
      nullsAsUndefineds: true,
    });

    const action =
      this.editData && this.editData.method !== 'create'
        ? this.api.request('post', endpoints.update, this.formData)
        : this.api.request('post', endpoints.store, this.formData);

    this.manageRecord(action);
  }

  allFields() {
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
      this.#fieldBuilder.fieldBuilder([this.#slugField.getSlugField()]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: 'screen_shot',
          className: 'col-12',
          type: 'file-field',
          props: {
            fileLabel: _('Select screen shot'),
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder(this.linkMultiLang()),
      this.#fieldBuilder.fieldBuilder(this.iconField()),
      this.#fieldBuilder.fieldBuilder(this.featuredImageField()),
    ];
  }

  #BuildLangFields(lang: string): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder(this.title(lang)),
      this.#fieldBuilder.fieldBuilder(this.link(lang)),
      this.#fieldBuilder.fieldBuilder(this.description(lang)),
    ];
  }

  featuredImageField(): FormlyFieldConfig[] {
    return [
      {
        key: 'featured_image',
        type: 'file-field',
        props: {
          fileLabel: _('Select featured image'),
        },
      },
    ];
  }

  description(lang: string): FormlyFieldConfig[] {
    return [
      {
        key: `description_${lang}`,
        type: 'textarea-field',
        props: {
          label: _('description'),
        },
      },
    ];
  }

  link(lang: string): FormlyFieldConfig[] {
    return [
      {
        key: `value_${lang}`,
        type: 'floated-input-field',
        props: {
          label: _('Link'),
        },
      },
    ];
  }

  title(lang: string): FormlyFieldConfig[] {
    return [
      {
        key: `title_${lang}`,
        type: 'floated-input-field',
        props: {
          label: _('title'),
        },
      },
    ];
  }

  linkMultiLang(): FormlyFieldConfig[] {
    return [
      {
        key: 'default_value',
        type: 'floated-input-field',
        props: {
          label: _('Link'),
        },
      },
    ];
  }

  iconField(): FormlyFieldConfig[] {
    return [
      {
        key: 'icon',
        type: 'floated-input-field',
        props: {
          label: _('icon'),
        },
      },
    ];
  }
}
