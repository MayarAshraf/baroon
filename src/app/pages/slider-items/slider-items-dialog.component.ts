import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  BaseCreateUpdateComponent,
  CachedListService,
  FieldBuilderService,
  FormComponent,
  LangService,
  SpinnerComponent,
  StaticDataService,
} from '@shared';
import { ButtonModule } from 'primeng/button';
import { map } from 'rxjs';
import { SliderItemsModel } from './services/service-type';

@Component({
  selector: 'app-slider-items-dialog',
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
export class SliderItemsDialogComponent extends BaseCreateUpdateComponent<SliderItemsModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #languages = inject(StaticDataService).languages;
  #cacheList = inject(CachedListService);
  #currentLang = inject(LangService).currentLanguage;

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      dialogData$: this.#cacheList.getListData('sliders/sliders', 'GET'),

      endpoints: {
        store: 'sliders/slider-items',
        update: 'sliders/slider-items/update',
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Update Slider Items')),
        submitButtonLabel: this.translate.instant(_('Update Slider Items')),
      };
      this.model = new SliderItemsModel(this.editData, this.#currentLang());
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Create Slider Items')),
        submitButtonLabel: this.translate.instant(_('Create Slider Items')),
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
        {
          key: 'project',
          type: 'autocomplete-field',
          props: {
            labelTarget: 'title',
            placeholder: _('select project'),
            endpoint: `inventory/list/projects`,
            fieldKey: 'project_id',
          },
        },
        {
          key: 'project_id',
        },
        {
          key: 'slider_id',
          type: 'select-field',
          props: {
            required: true,
            isFloatedLabel: true,
            label: _('Select Slider'),
            placeholder: _('Select Slider'),
            options: this.#cacheList.getListData('sliders/sliders', 'GET').pipe(
              map((data) =>
                data.map((item: any) => ({
                  label: item[`title_${this.#currentLang()}`],
                  value: item.id,
                }))
              )
            ),
          },
        },
      ]),
      {
        key: 'image',
        type: 'file-field',
        props: {
          label: _(`image`),
          description: _(
            'Recommended image dimensions: 2560 px width by 1280 px height, with a maximum file size of 100 KB. Allowed format is jpeg, jpg, png'
          ),
        },
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
          key: `subtitle_${lang}`,
          type: 'floated-input-field',
          props: {
            label: _(`subtitle`),
            placeholder: _(`subtitle`),
          },
        },
        {
          key: `description_${lang}`,
          type: 'textarea-field',
          className: 'col-12',
          props: {
            label: _(`description`),
            placeholder: _(`description`),
          },
        },
      ]),
    ];
  }
}
