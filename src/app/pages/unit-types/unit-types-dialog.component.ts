import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { LookupsService } from '@pages/lookups/services/lookups.service';
import {
  BaseCreateUpdateComponent,
  FieldBuilderService,
  FormComponent,
  LangService,
  SpinnerComponent,
  StaticDataService,
} from '@shared';
import { ButtonModule } from 'primeng/button';
import { combineLatest, map } from 'rxjs';
import { UnitTypesModel } from './services/service-type';

@Component({
  selector: 'app-unit-types-dialog',
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
export class UnitTypesDialogComponent extends BaseCreateUpdateComponent<UnitTypesModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #languages = inject(StaticDataService).languages;
  #currentLang = inject(LangService).currentLanguage;
  #lookups = inject(LookupsService);
  hiddenFields: string[] = [];

  ngOnInit() {
    this.hiddenFields = this.editData.purposes.attributes;
    this.dialogMeta = {
      ...this.dialogMeta,
      dialogData$: combineLatest([
        this.#lookups.getLookupsList('areaunits'),
        this.#lookups.getLookupsList('furnishingstatus'),
        this.#lookups.getLookupsList('finishingtype'),
        this.#lookups.getLookupsList('amenities'),
        this.#lookups.getLookupsList('facility'),
        this.#lookups.getLookupsList('currencies'),
        this.#lookups.getLookupsList('paymentmethod'),
        this.#lookups.getLookupsList('offeringtype'),
        this.#lookups.getLookupsList('purposetype'),
        this.#lookups.getLookupsList('views'),
        this.#lookups.getLookupsList('services'),
      ]),
      endpoints: {
        store: 'inventory/unit-types',
        update: 'inventory/unit-types/update',
      },
    };

    if (this.editData && this.editData.method !== 'create') {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogSubtitle: this.editData.purposes.default_name,
        subtitleLink: 'lookups/purpose/' + this.editData.purposes.parent_id,
        dialogTitle: this.translate.instant(_('Update Unit Type')),
        submitButtonLabel: this.translate.instant(_('Update Unit Type')),
      };
      this.model = new UnitTypesModel(this.editData, this.#currentLang());
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Create Unit Type')),
        submitButtonLabel: this.translate.instant(_('Create Unit Type')),
      };
      this.model = new UnitTypesModel(this.editData, this.#currentLang());
    }
    this.#updateFields();
  }

  #updateFields() {
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        key: 'project_id',
      },
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
        key: 'order',
        type: 'floated-input-field',
        props: {
          type: 'number',
          label: _('order'),
          min: 0,
        },
      },

      {
        fieldGroup: [
          {
            type: 'separator-field',
            props: {
              title: this.translate.instant(_('Units Info')),
              icon: 'pi pi-info-circle',
            },
          },
          this.#fieldBuilder.fieldBuilder([
            {
              key: 'purpose_type_id',
              type: 'select-field',
              props: {
                isFloatedLabel: true,
                label: _('Select purpose type'),
                placeholder: _('Select purpose type'),
                options: this.#lookups.getLookupsList('purposetype').pipe(
                  map((data) =>
                    data.map((item: any) => ({
                      label: item[`name_${this.#currentLang()}`],
                      value: item.id,
                    })),
                  ),
                ),
              },
            },
            {
              key: 'offering_type_ids',
              type: 'select-field',
              expressions: {
                hide: (field) => this.#checkHiddenFields(field.key as string),
              },
              props: {
                multiple: true,
                isFloatedLabel: true,
                label: _('Select offering types'),
                placeholder: _('Select offering types'),
                options: this.#lookups.getLookupsList('offeringtype').pipe(
                  map((data) =>
                    data.map((item: any) => ({
                      label: item[`name_${this.#currentLang()}`],
                      value: item.id,
                    })),
                  ),
                ),
              },
            },
          ]),
          this.#fieldBuilder.fieldBuilder([
            {
              key: 'furnishing_status_ids',
              type: 'select-field',
              expressions: {
                hide: (field) => this.#checkHiddenFields(field.key as string),
              },
              props: {
                multiple: true,
                isFloatedLabel: true,
                label: _('Select furnishing status'),
                placeholder: _('Select furnishing status'),
                options: this.#lookups.getLookupsList('furnishingstatus').pipe(
                  map((data) =>
                    data.map((item: any) => ({
                      label: item[`name_${this.#currentLang()}`],
                      value: item.id,
                    })),
                  ),
                ),
              },
            },
            {
              key: 'number_of_units',
              type: 'floated-input-field',
              expressions: {
                hide: (field) => this.#checkHiddenFields(field.key as string),
              },
              props: {
                type: 'number',
                min: 0,
                label: _('Units Number'),
              },
            },
          ]),
          this.#fieldBuilder.fieldBuilder([
            {
              key: 'area_unit_id',
              type: 'select-field',
              expressions: {
                hide: (field) => this.#checkHiddenFields(field.key as string),
              },
              props: {
                isFloatedLabel: true,
                label: _('Select area unit'),
                placeholder: _('Select area unit'),
                options: this.#lookups.getLookupsList('areaunits').pipe(
                  map((data) =>
                    data.map((item: any) => ({
                      label: item[`name_${this.#currentLang()}`],
                      value: item.id,
                    })),
                  ),
                ),
              },
            },
            {
              key: 'finishing_type_ids',
              type: 'select-field',
              expressions: {
                hide: (field) => this.#checkHiddenFields(field.key as string),
              },
              props: {
                multiple: true,
                isFloatedLabel: true,
                label: _('Select finishing types'),
                placeholder: _('Select finishing types'),
                options: this.#lookups.getLookupsList('finishingtype').pipe(
                  map((data) =>
                    data.map((item: any) => ({
                      label: item[`name_${this.#currentLang()}`],
                      value: item.id,
                    })),
                  ),
                ),
              },
            },
          ]),
          this.#fieldBuilder.fieldBuilder([
            {
              key: 'view_ids',
              type: 'select-field',
              expressions: {
                hide: (field) => this.#checkHiddenFields(field.key as string),
              },
              props: {
                multiple: true,
                isFloatedLabel: true,
                label: _('Select views'),
                placeholder: _('Select views'),
                options: this.#lookups.getLookupsList('views').pipe(
                  map((data) =>
                    data.map((item: any) => ({
                      label: item[`name_${this.#currentLang()}`],
                      value: item.id,
                    })),
                  ),
                ),
              },
            },
            {
              key: 'service_ids',
              type: 'select-field',
              expressions: {
                hide: (field) => this.#checkHiddenFields(field.key as string),
              },
              props: {
                multiple: true,
                isFloatedLabel: true,
                label: _('Select services'),
                placeholder: _('Select services'),
                options: this.#lookups.getLookupsList('services').pipe(
                  map((data) =>
                    data.map((item: any) => ({
                      label: item[`name_${this.#currentLang()}`],
                      value: item.id,
                    })),
                  ),
                ),
              },
            },
          ]),
          this.#fieldBuilder.fieldBuilder([
            {
              key: 'amenity_ids',
              type: 'select-field',
              expressions: {
                hide: (field) => this.#checkHiddenFields(field.key as string),
              },
              props: {
                multiple: true,
                isFloatedLabel: true,
                label: _('Select amenities'),
                placeholder: _('Select amenities'),
                options: this.#lookups.getLookupsList('amenities').pipe(
                  map((data) =>
                    data.map((item: any) => ({
                      label: item[`name_${this.#currentLang()}`],
                      value: item.id,
                    })),
                  ),
                ),
              },
            },
            {
              key: 'facility_ids',
              type: 'select-field',
              expressions: {
                hide: (field) => this.#checkHiddenFields(field.key as string),
              },
              props: {
                multiple: true,
                isFloatedLabel: true,
                label: _('Select facilities'),
                placeholder: _('Select facilities'),
                options: this.#lookups.getLookupsList('facility').pipe(
                  map((data) =>
                    data.map((item: any) => ({
                      label: item[`name_${this.#currentLang()}`],
                      value: item.id,
                    })),
                  ),
                ),
              },
            },
          ]),
          {
            template: `<div class="border-1 border-200 mb-3"></div>`,
          },
        ],
      },
      {
        fieldGroup: [
          {
            type: 'separator-field',
            props: {
              title: this.translate.instant(_('payments')),
              icon: 'fa-solid fa-cart-shopping',
            },
          },
          this.#fieldBuilder.fieldBuilder([
            {
              key: 'payment_method_ids',
              type: 'select-field',
              props: {
                multiple: true,
                isFloatedLabel: true,
                label: _('Select payment methods'),
                placeholder: _('Select payment methods'),
                options: this.#lookups.getLookupsList('paymentmethod').pipe(
                  map((data) =>
                    data.map((item: any) => ({
                      label: item[`name_${this.#currentLang()}`],
                      value: item.id,
                    })),
                  ),
                ),
              },
            },
            {
              key: 'currency_id',
              type: 'select-field',
              props: {
                isFloatedLabel: true,
                label: _('currency code'),
                placeholder: _('currency code'),
                options: this.#lookups.getLookupsList('currencies').pipe(
                  map((data) =>
                    data.map((item: any) => ({
                      label: item[`name_${this.#currentLang()}`],
                      value: item.id,
                    })),
                  ),
                ),
              },
            },
          ]),
          this.#fieldBuilder.fieldBuilder([
            {
              key: 'number_of_installments_years_from',
              type: 'floated-input-field',
              expressions: {
                hide: (field) => this.#checkHiddenFields(field.key as string),
              },
              props: {
                type: 'number',
                min: 0,
                label: _('installments years from'),
              },
            },
            {
              key: 'number_of_installments_years_to',
              type: 'floated-input-field',
              props: {
                fieldValidate: 'Installments Years From',
                type: 'number',
                min: 0,
                label: _('installments years to'),
              },
              expressions: {
                hide: (field) => this.#checkHiddenFields(field.key as string),
                'props.min': 'model.number_of_installments_years_from',
              },
            },
          ]),

          {
            key: 'down_payment',
            type: 'floated-input-field',
            expressions: {
              hide: (field) => this.#checkHiddenFields(field.key as string),
            },
            props: {
              type: 'number',
              min: 0,
              label: _('down payment'),
            },
          },

          {
            template: `<div class="border-1 border-200 mb-3"></div>`,
            expressions: {
              hide: () =>
                this.#checkHiddenFields('price_from') &&
                this.#checkHiddenFields('price_to') &&
                this.#checkHiddenFields('area_from') &&
                this.#checkHiddenFields('area_to'),
            },
          },
        ],
      },
      {
        fieldGroup: [
          {
            type: 'separator-field',
            props: {
              title: this.translate.instant(_('Units Details')),
              icon: 'pi pi-info-circle',
            },
            expressions: {
              hide: () =>
                this.#checkHiddenFields('price_from') &&
                this.#checkHiddenFields('price_to') &&
                this.#checkHiddenFields('area_from') &&
                this.#checkHiddenFields('area_to'),
            },
          },
          this.#fieldBuilder.fieldBuilder([
            {
              key: 'price_from',
              type: 'floated-input-field',
              props: {
                type: 'number',
                label: _('price from'),
                min: 0,
              },
            },
            {
              key: 'price_to',
              type: 'floated-input-field',
              props: {
                fieldValidate: 'Price From',
                type: 'number',
                label: _('price to'),
              },
              expressions: {
                'props.min': 'model.price_from',
              },
            },
          ]),
          this.#fieldBuilder.fieldBuilder([
            {
              key: 'area_from',
              type: 'floated-input-field',
              props: {
                type: 'number',
                label: _('area from'),
                min: 0,
              },
            },
            {
              key: 'area_to',
              type: 'floated-input-field',
              props: {
                type: 'number',
                fieldValidate: 'Area From',
                label: _('area to'),
              },
              expressions: {
                'props.min': 'model.area_from',
              },
            },
          ]),
          {
            template: `<div class="border-1 border-200 mb-3"></div>`,
            expressions: {
              hide: () =>
                this.#checkHiddenFields('bathroom_from') &&
                this.#checkHiddenFields('bathroom_to'),
            },
          },
        ],
      },
      {
        fieldGroup: [
          {
            type: 'separator-field',
            props: {
              title: this.translate.instant(_('Bathrooms')),
              icon: 'fa-solid fa-bath',
            },
            expressions: {
              hide: () =>
                this.#checkHiddenFields('bathroom_from') &&
                this.#checkHiddenFields('bathroom_to'),
            },
          },
          this.#fieldBuilder.fieldBuilder([
            {
              key: 'bathroom_from',
              type: 'floated-input-field',
              expressions: {
                hide: (field) => this.#checkHiddenFields(field.key as string),
              },
              props: {
                label: _('bathrooms from'),
                min: 0,
              },
            },
            {
              key: 'bathroom_to',
              type: 'floated-input-field',
              props: {
                fieldValidate: 'Bathroom From',
                label: _('bathrooms to'),
                min: 0,
              },
              expressions: {
                hide: (field) => this.#checkHiddenFields(field.key as string),
                'props.min': 'model.bathroom_from',
              },
            },
          ]),
        ],
      },
      {
        fieldGroup: [
          {
            type: 'separator-field',
            props: {
              title: this.translate.instant(_('Bedrooms')),
              icon: 'fa-solid fa-bed',
            },
            expressions: {
              hide: () =>
                this.#checkHiddenFields('bedroom_from') &&
                this.#checkHiddenFields('bedroom_to'),
            },
          },
          this.#fieldBuilder.fieldBuilder([
            {
              key: 'bedroom_from',
              type: 'floated-input-field',
              expressions: {
                hide: (field) => this.#checkHiddenFields(field.key as string),
              },
              props: {
                label: _('bedrooms from'),
                min: 0,
              },
            },
            {
              key: 'bedroom_to',
              type: 'floated-input-field',
              props: {
                fieldValidate: 'Bedroom From',
                label: _('bedrooms to'),
                min: 0,
              },
              expressions: {
                hide: (field) => this.#checkHiddenFields(field.key as string),
                'props.min': 'model.bedroom_from',
              },
            },
          ]),
        ],
      },
      {
        template: `<div class="border-1 border-200 mb-3"></div>`,
      },
      {
        key: 'featured_image',
        type: 'file-field',
        props: {
          chooseLabel: _('upload Image'),
          description: _('Allowed format is jpeg, jpg, png'),
          fileLabel: _('Featured Image'),
        },
      },
    ];
  }

  #BuildLangFields(lang: string): FormlyFieldConfig[] {
    return [
      {
        fieldGroup: [
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
        ],
      },
    ];
  }

  #checkHiddenFields(fieldKey: string): boolean {
    return !this.hiddenFields.includes(fieldKey);
  }
}
