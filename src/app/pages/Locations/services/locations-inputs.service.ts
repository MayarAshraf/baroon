import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ApiService, FieldBuilderService, LangService } from '@shared';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationsInputsService {
  #fieldBuilder = inject(FieldBuilderService);
  #currentLang = inject(LangService).currentLanguage;
  #api = inject(ApiService);
  #destroyRef = inject(DestroyRef);

  defaultCountry = signal(1);
  countryKey = signal('country_id');
  regionKey = signal('region_id');
  cityKey = signal('city_id');
  areaKey = signal('area_place_id');

  getLocationFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        this.getCountryField(),
        this.getRegionField(),
        this.getCityField(),
        this.getAreaField(),
      ]),
    ];
  }

  #getLocationsOptions(
    field: FormlyFieldConfig | undefined,
    locationName: string,
    locationId: number | null,
    locationParentName: string | null
  ) {
    const endpoint = !locationParentName
      ? `locations/${locationName}`
      : `locations/${locationName}?${locationParentName}=${locationId}`;

    this.#api
      .request('get', endpoint)
      .pipe(
        map(({ data }) => data),
        map((data) =>
          data.map((item: any) => ({
            label: item[`name_${this.#currentLang()}`],
            value: item.id,
          }))
        ),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((data) => {
        field?.props && (field.props.options = data);
      });
  }

  getCountryField(data?: any): FormlyFieldConfig {
    return {
      key: this.countryKey(),
      type: 'select-field',
      className: data?.className,
      resetOnHide: false,
      expressions: {
        hide: data?.hide ?? false,
        'props.required': data?.required ?? false,
        'props.disabled': data?.disabled ?? false,
      },
      props: {
        label: _('country'),
        placeholder: _('select_country'),
        isFloatedLabel: true,
        filter: true,
        options: [],
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
      hooks: {
        onInit: (field) => {
          const regionField = field.parent?.get?.(this.regionKey());
          this.#getLocationsOptions(field, 'getCountries', null, null);

          if (field.formControl?.value) {
            this.#getLocationsOptions(
              regionField,
              'getCountryRegions',
              field.formControl?.value,
              'location_id'
            );
          }
          return field.formControl?.valueChanges.pipe(
            tap((id) => {
              if (id) {
                this.#getLocationsOptions(
                  regionField,
                  'getCountryRegions',
                  id,
                  'location_id'
                );
              }
              regionField?.formControl?.setValue(null);
            })
          );
        },
      },
    };
  }

  getRegionField(data?: any): FormlyFieldConfig {
    return {
      key: this.regionKey(),
      type: 'select-field',
      className: data?.className,
      resetOnHide: false,
      expressions: {
        hide: data?.hide ?? ((field) => !field.model?.[this.countryKey()]),
        'props.required': data?.required ?? false,
        'props.disabled': data?.disabled ?? false,
      },
      props: {
        label: _('region'),
        placeholder: _('select region'),
        isFloatedLabel: true,
        filter: true,
        options: [],
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
      hooks: {
        onInit: (field) => {
          const cityField = field.parent?.get?.(this.cityKey());

          if (field.formControl?.value) {
            this.#getLocationsOptions(
              cityField,
              'getRegionCities',
              field.formControl?.value,
              'location_id'
            );
          }

          return field.formControl?.valueChanges.pipe(
            tap((id) => {
              if (id) {
                this.#getLocationsOptions(
                  cityField,
                  'getRegionCities',
                  id,
                  'location_id'
                );
              }
              cityField?.formControl?.setValue(null);
            })
          );
        },
      },
    };
  }

  getCityField(data?: any): FormlyFieldConfig {
    return {
      key: this.cityKey(),
      type: 'select-field',
      className: data?.className,
      resetOnHide: false,
      expressions: {
        hide: data?.hide ?? ((field) => !field.model?.[this.regionKey()]),
        'props.required': data?.required ?? false,
        'props.disabled': data?.disabled ?? false,
      },
      props: {
        label: _('city'),
        placeholder: _('select_city'),
        isFloatedLabel: true,
        filter: true,
        options: [],
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
      hooks: {
        onInit: (field) => {
          const areaField = field.parent?.get?.(this.areaKey());

          if (field.formControl?.value) {
            this.#getLocationsOptions(
              areaField,
              'getCityAreas',
              field.formControl?.value,
              'location_id'
            );
          }

          return field.formControl?.valueChanges.pipe(
            tap((id) => {
              if (id) {
                this.#getLocationsOptions(
                  areaField,
                  'getCityAreas',
                  id,
                  'location_id'
                );
              }
              areaField?.formControl?.setValue(null);
            })
          );
        },
      },
    };
  }

  getAreaField(data?: any): FormlyFieldConfig {
    return {
      key: this.areaKey(),
      type: 'select-field',
      className: data?.className,
      resetOnHide: false,
      expressions: {
        hide: data?.hide ?? ((field) => !field.model?.[this.cityKey()]),
        'props.required': data?.required ?? false,
        'props.disabled': data?.disabled ?? false,
      },
      props: {
        label: _('area_place'),
        isFloatedLabel: true,
        filter: true,
        options: [],
        change(field, event) {
          event.originalEvent.stopPropagation();
        },
      },
    };
  }
}
