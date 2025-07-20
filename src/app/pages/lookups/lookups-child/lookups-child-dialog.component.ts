import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { SlugInputService } from '@gService/slug-input.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  BaseCreateUpdateComponent,
  CachedListService,
  FieldBuilderService,
  FormComponent,
  SpinnerComponent,
  StaticDataService,
} from '@shared';
import { ButtonModule } from 'primeng/button';
import { distinctUntilChanged, map, tap } from 'rxjs';
import { lookupChildModel } from './service/service-type';

@Component({
  selector: 'app-lookups-child-dialog',
  standalone: true,
  imports: [
    AsyncPipe,
    TranslateModule,
    ButtonModule,
    RouterLink,
    SpinnerComponent,
    FormComponent,
  ],
  templateUrl:
    '/src/app/shared/components/basic-crud/base-create-update/base-create-update.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LookupsChildDialogComponent extends BaseCreateUpdateComponent<lookupChildModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #languages = inject(StaticDataService).languages;
  #slugField = inject(SlugInputService);
  #cacheList = inject(CachedListService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: 'lookups/lookup',
        update: 'lookups/lookup/update',
      },
    };

    if (this.editData && this.editData.method != 'create') {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Update lookups')),
        submitButtonLabel: this.translate.instant(_('Update lookups')),
      };
      this.model = new lookupChildModel(this.editData);
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Create lookups')),
        submitButtonLabel: this.translate.instant(_('Create lookups')),
      };
      this.model = new lookupChildModel({
        parent_id: this.editData.parent_id,
      });
    }
    this.#updateFields();
  }

  #updateFields() {
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    if (
      this.editData &&
      this.editData.method != 'create' &&
      this.editData.parent.slug === 'purpose'
    ) {
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
          {
            key: 'slug',
            type: 'floated-input-field',
            props: {
              required: true,
              label: _('slug'),
              disabled: !this.editData.is_deletable,
            },
            hooks: {
              onInit: (field: FormlyFieldConfig) => {
                return field.formControl?.valueChanges.pipe(
                  distinctUntilChanged(),
                  tap((val) => {
                    let transformedValue = val
                      .toLowerCase()
                      .replace(/\s+/g, '-');
                    field.formControl?.setValue(transformedValue);
                  })
                );
              },
            },
          },
        ]),
        {
          key: 'attributes',
          type: 'select-field',
          props: {
            multiple: true,
            isFloatedLabel: true,
            label: _('visible fields'),
            placeholder: _('visible fields'),
            options: this.#cacheList
              .getListData('inventory/unit-types/staticList/fields', 'GET')
              .pipe(
                map((data) =>
                  data.map((item: any) => ({
                    label: item.label,
                    value: item.value,
                  }))
                )
              ),
          },
        },
        {
          key: 'is_default',
          type: 'switch-field',
          props: {
            trueValue: 1,
            falseValue: 0,
            label: _(`is Default`),
          },
        },
        {
          key: 'image',
          type: 'file-field',
          props: {
            chooseLabel: _('upload Image'),
            description: _('Allowed format is jpeg, jpg, png'),
            fileLabel: _('image'),
          },
        },
      ];
    } else {
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
          {
            key: 'is_default',
            type: 'switch-field',
            props: {
              trueValue: 1,
              falseValue: 0,
              label: _(`is Default`),
            },
          },
        ]),
        {
          key: 'image',
          type: 'file-field',
          props: {
            chooseLabel: _('upload Image'),
            description: _('Allowed format is jpeg, jpg, png'),
            fileLabel: _('image'),
          },
        },
      ];
    }
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
        // {
        //   key: `description_${lang}`,
        //   className: 'col-12',
        //   type: 'textarea',
        //   props: {
        //     label: _('description'),
        //   },
        // },
      ]),
    ];
  }
}
