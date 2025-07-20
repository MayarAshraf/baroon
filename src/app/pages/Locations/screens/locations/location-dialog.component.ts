import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { SlugInputService } from '@gService/slug-input.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { LocationModel } from '@pages/Locations/services/service-types';
import {
  BaseCreateUpdateComponent,
  FieldBuilderService,
  FormComponent,
  SpinnerComponent,
  StaticDataService,
} from '@shared';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-location-cu',
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
export class LocationDialogComponent extends BaseCreateUpdateComponent<LocationModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #languages = inject(StaticDataService).languages;
  #slugField = inject(SlugInputService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      dialogTitle: this.translate.instant(_('Create Location')),
      submitButtonLabel: this.translate.instant(_('Create Location')),
      endpoints: {
        store: 'locations/location',
        update: 'locations/location/update',
      },
    };

    if (this.editData && !(this.editData.method === 'create')) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Update Location')),
        submitButtonLabel: this.translate.instant(_('Update Location')),
      };
      this.model = {
        ...new LocationModel(this.editData),
        id: this.editData.id,
      };
    } else if (this.editData && this.editData.method === 'create') {
      this.model = {
        ...new LocationModel(),
        no_redirect: 1,
        parent_id: this.editData.id,
      };
    } else {
      this.model = {
        ...new LocationModel(),
        no_redirect: 1,
      };
    }
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          type: 'tabs-field',
          fieldGroup: this.#languages.map((lang) => ({
            props: {
              label: `${lang.label} (${lang.value.toUpperCase()})`,
            },
            fieldGroup: this.#BuildLangFields(lang.value),
          })),
        },
        this.#slugField.getSlugField(),
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: 'order',
          type: 'floated-input-field',
          expressions: {
            'props.placeholder': this.translate.stream(_('order')),
            'props.label': this.translate.stream(_('order')),
          },
          props: {
            type: 'number',
            required: true,
            min: 0,
          },
        },
        {
          key: 'code',
          type: 'floated-input-field',
          expressions: {
            'props.placeholder': this.translate.stream(_('code')),
            'props.label': this.translate.stream(_('code')),
          },
          props: {
            required: true,
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
