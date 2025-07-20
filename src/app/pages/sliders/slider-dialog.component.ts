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
import { SliderModel } from './services/service-type';

@Component({
  selector: 'app-slider-dialog',
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
export class SliderDialogComponent extends BaseCreateUpdateComponent<SliderModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #languages = inject(StaticDataService).languages;
  #slugField = inject(SlugInputService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: 'sliders/slider',
        update: 'sliders/slider/update',
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Update Slider')),
        submitButtonLabel: this.translate.instant(_('Update Slider')),
      };
      this.model = new SliderModel(this.editData);
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Create Slider')),
        submitButtonLabel: this.translate.instant(_('Create Slider')),
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
      this.#fieldBuilder.fieldBuilder([this.#slugField.getSlugField()]),
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
      ]),
    ];
  }
}
