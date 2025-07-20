import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { LocationsInputsService } from '@pages/Locations/services/locations-inputs.service';
import { LookupsService } from '@pages/lookups/services/lookups.service';
import { UnitTypesDialogComponent } from '@pages/unit-types/unit-types-dialog.component';
import {
  BaseCreateUpdateComponent,
  FieldBuilderService,
  FormComponent,
  GlobalApiResponse,
  LangPropPipe,
  LangService,
  SpinnerComponent,
  StaticDataService,
} from '@shared';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  combineLatest,
  distinctUntilChanged,
  finalize,
  map,
  Observable,
  tap,
} from 'rxjs';
import { Project, ProjectModel } from './services/service-type';
@Component({
  selector: 'app-project-dialog',
  standalone: true,
  templateUrl: './project-dialog.component.html',
  styles: `:host ::ng-deep{
    .p-accordion-header-text{
      font-size: 1.25rem;
      font-weight: 500
    }
    .p-accordion-toggle-icon{
      font-size: 1.25rem;
      font-weight: 900;
    }
  }`,
  imports: [
    AsyncPipe,
    TranslateModule,
    DropdownModule,
    ButtonModule,
    LangPropPipe,
    ChipModule,
    SpinnerComponent,
    FormComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDialogComponent extends BaseCreateUpdateComponent<ProjectModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #languages = inject(StaticDataService).languages;
  #lookups = inject(LookupsService);
  currentLang = inject(LangService).currentLanguage;
  #locationsInputs = inject(LocationsInputsService);
  #dialogService = inject(DialogService);
  unitTypes = signal<number[]>([]);

  removeUnitTypes(id: number) {
    this.unitTypes.update((oldids) => oldids.filter((item) => item !== id));
    this.model = {
      ...this.model,
      unit_type_ids: this.unitTypes(),
    };
  }

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      dialogData$: combineLatest([
        this.#lookups.getLookupsList('purpose'),
        this.#lookups.getLookupsList('amenities'),
        this.#lookups.getLookupsList('facility'),
        this.#lookups.getLookupsList('views'),
        this.#lookups.getLookupsList('services'),
      ]),
      endpoints: {
        store: 'inventory/projects',
        update: 'inventory/projects/update',
      },
    };

    if (this.editData) {
      this.unitTypes.set(this.editData.unit_type_ids);
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Update Project')),
        submitButtonLabel: this.translate.instant(_('Update Project')),
      };
      this.model = new ProjectModel(this.editData);
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Create Project')),
        submitButtonLabel: this.translate.instant(_('Create Project')),
      };
      this.model = new ProjectModel();
    }
    this.#updateFields();
  }

  #updateFields() {
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
                props: {
                  label: _('Published'),
                  trueValue: 1,
                  falseValue: 0,
                },
              },
              {
                key: 'is_featured',
                type: 'switch-field',
                props: {
                  label: _('Featured'),
                  trueValue: 1,
                  falseValue: 0,
                },
              },
            ],
          },
          {
            className: 'col-12 xl:col-10 lg:col-9 md:col-8 px-3 pt-4 sm:pt-0 ',
            fieldGroup: [
              {
                fieldGroup: [
                  {
                    type: 'separator-field',
                    props: {
                      title: this.translate.instant(_('Project Information')),
                      icon: 'pi pi-info-circle',
                    },
                  },
                  this.#fieldBuilder.fieldBuilder([
                    {
                      key: 'project_number',
                      type: 'floated-input-field',
                      props: {
                        type: 'number',
                        label: _('project number'),
                        min: 0,
                      },
                    },
                    {
                      key: 'project_slug',
                      type: 'floated-input-field',
                      props: {
                        required: true,
                        label: _('NA'),
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
                            }),
                          );
                        },
                      },
                    },
                  ]),
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
                    template: `<div class="border-1 border-200 mb-3"></div>`,
                  },
                ],
              },
              {
                fieldGroup: [
                  ...this.#buildSeoLangFields(),
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
                      title: this.translate.instant(_('location information')),
                      icon: 'fas fa-location-dot',
                    },
                  },
                  this.#fieldBuilder.fieldBuilder([
                    ...this.#locationsInputs.getLocationFields(),
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
                      title: this.translate.instant(_('Project Details')),
                      icon: 'pi pi-info-circle',
                    },
                  },
                  this.#fieldBuilder.fieldBuilder([
                    {
                      key: 'purpose_id',
                      type: 'select-field',
                      props: {
                        required: true,
                        isFloatedLabel: true,
                        label: _('Select purpose'),
                        placeholder: _('Select purpose'),
                        options: this.#lookups.getLookupsList('purpose').pipe(
                          map((data) =>
                            data.map((item: any) => ({
                              label: item[`name_${this.currentLang()}`],
                              value: item.id,
                            })),
                          ),
                        ),
                      },
                    },
                    {
                      key: 'area_unit_id',
                      type: 'select-field',
                      props: {
                        isFloatedLabel: true,
                        label: _('Select area unit'),
                        placeholder: _('Select area unit'),
                        options: this.#lookups.getLookupsList('areaUnits').pipe(
                          map((data) =>
                            data.map((item: any) => ({
                              label: item[`name_${this.currentLang()}`],
                              value: item.id,
                            })),
                          ),
                        ),
                      },
                    },
                  ]),
                  this.#fieldBuilder.fieldBuilder([
                    {
                      key: 'area',
                      type: 'floated-input-field',
                      props: {
                        type: 'number',
                        label: _('area'),
                        min: 1,
                        fieldValidate: 1,
                      },
                    },
                    {
                      key: 'delivery_date',
                      type: 'date-field',
                      props: {
                        label: _('delivery date'),
                      },
                    },
                    {
                      key: 'view_ids',
                      type: 'select-field',
                      props: {
                        multiple: true,
                        isFloatedLabel: true,
                        label: _('Select views'),
                        placeholder: _('Select views'),
                        options: this.#lookups.getLookupsList('views').pipe(
                          map((data) =>
                            data.map((item: any) => ({
                              label: item[`name_${this.currentLang()}`],
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
                      props: {
                        multiple: true,
                        isFloatedLabel: true,
                        label: _('Select amenities'),
                        placeholder: _('Select amenities'),
                        options: this.#lookups.getLookupsList('amenities').pipe(
                          map((data) =>
                            data.map((item: any) => ({
                              label: item[`name_${this.currentLang()}`],
                              value: item.id,
                            })),
                          ),
                        ),
                      },
                    },
                    {
                      key: 'service_ids',
                      type: 'select-field',
                      props: {
                        multiple: true,
                        isFloatedLabel: true,
                        label: _('Select services'),
                        placeholder: _('Select services'),
                        options: this.#lookups.getLookupsList('services').pipe(
                          map((data) =>
                            data.map((item: any) => ({
                              label: item[`name_${this.currentLang()}`],
                              value: item.id,
                            })),
                          ),
                        ),
                      },
                    },
                    {
                      key: 'facility_ids',
                      type: 'select-field',
                      props: {
                        multiple: true,
                        isFloatedLabel: true,
                        label: _('Select facilities'),
                        placeholder: _('Select facilities'),
                        options: this.#lookups.getLookupsList('facility').pipe(
                          map((data) =>
                            data.map((item: any) => ({
                              label: item[`name_${this.currentLang()}`],
                              value: item.id,
                            })),
                          ),
                        ),
                      },
                    },
                  ]),
                  {
                    key: `video_iframe`,
                    type: 'textarea-field',
                    props: {
                      label: _('video iframe'),
                    },
                  },
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
                      title: this.translate.instant(_('Media Uploads')),
                      icon: 'pi pi-arrow-circle-up',
                    },
                  },
                  this.#fieldBuilder.fieldBuilder([
                    {
                      key: 'logo',
                      type: 'file-field',
                      props: {
                        required: !this.editData,
                        chooseLabel: _('upload Image'),
                        description: _('Allowed format is jpeg, jpg, png'),
                        fileLabel: _('logo'),
                      },
                    },
                    {
                      key: 'featured_image',
                      type: 'file-field',
                      props: {
                        required: !this.editData,
                        chooseLabel: _('upload Image'),
                        description: _('Allowed format is jpeg, jpg, png'),
                        fileLabel: _('Featured image'),
                      },
                    },
                  ]),
                  this.#fieldBuilder.fieldBuilder([
                    {
                      key: 'about_image',
                      type: 'file-field',
                      props: {
                        required: !this.editData,
                        chooseLabel: _('upload Image'),
                        description: _('Allowed format is jpeg, jpg, png'),
                        fileLabel: _('About Image'),
                      },
                    },
                    {
                      key: 'gallery_images',
                      type: 'file-field',
                      props: {
                        multiple: true,
                        chooseLabel: _(`upload Images`),
                        description: _('Allowed format is jpeg, jpg, png'),
                        fileLabel: _('Gallery images'),
                      },
                    },
                  ]),
                  this.#fieldBuilder.fieldBuilder([
                    {
                      key: 'master_plan_images',
                      type: 'file-field',
                      props: {
                        multiple: true,
                        chooseLabel: _(`upload Images`),
                        description: _('Allowed format is jpeg, jpg, png'),
                        fileLabel: _('master plan images'),
                      },
                    },
                    {
                      key: 'map_image',
                      type: 'file-field',
                      props: {
                        chooseLabel: _(`upload Images`),
                        description: _('Allowed format is jpeg, jpg, png'),
                        fileLabel: _('map image'),
                      },
                    },
                  ]),
                ],
              },
              {
                type: 'map-field',
                props: {
                  isReadOnlyMap: false,
                  isHiddenButton: false,
                  lat: 'latitude',
                  long: 'longitude',
                },
                hooks: {
                  onInit: (field) => {
                    const latField = field.form?.get(field.props?.lat);
                    const lngField = field.form?.get(field.props?.long);

                    return field.formControl?.valueChanges.pipe(
                      tap((latLng) => {
                        latField?.setValue(latLng.lat());
                        lngField?.setValue(latLng.lng());
                      }),
                    );
                  },
                },
              },
              {
                key: 'latitude',
                hooks: {
                  onInit: (field) => {
                    if (!field.model?.[field.props?.lat]) return;
                    field.formControl?.setValue(
                      field.model?.[field.props?.lat],
                    );
                  },
                },
              },
              {
                key: 'longitude',
                hooks: {
                  onInit: (field) => {
                    if (!field.model?.[field.props?.long]) return;
                    field.formControl?.setValue(
                      field.model?.[field.props?.long],
                    );
                  },
                },
              },
            ],
          },
        ],
      },
    ];
  }

  #seoFields(lang: string): FormlyFieldConfig[] {
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
        key: `meta_keywords_${lang}`,
        type: 'textarea-field',
        className: 'col-6',
        props: {
          label: _(`meta keywords`),
          placeholder: _(`meta keywords`),
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
                label: _(`title`),
                required: lang === 'en',
                placeholder: _(`title`),
              },
            },
            {
              key: `overview_description_${lang}`,
              type: 'textarea-field',
              className: 'col-12',
              props: {
                label: _(`overview description`),
                placeholder: _(`overview description`),
              },
            },
            {
              key: `short_description_${lang}`,
              type: 'textarea-field',
              className: 'col-12',
              props: {
                label: _(`short description`),
                placeholder: _(`short description`),
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

            {
              key: `address_${lang}`,
              type: 'textarea-field',
              className: 'col-12 mb-0',
              props: {
                label: _(`address`),
                placeholder: _(`address`),
              },
            },
          ]),
        ],
      },
    ];
  }

  protected dialogConfigUnit: DynamicDialogConfig<Project> = {
    showHeader: false,
    width: '800px',
    height: '100%',
    modal: true,
    focusOnShow: true,
    styleClass: 'm-0 max-h-full transform-none',
    position: this.currentLang() === 'en' ? 'right' : 'left',
    rtl: this.currentLang() !== 'en',
    closable: true,
    closeOnEscape: true,
    dismissableMask: false,
  };

  override manageRecord(action: Observable<GlobalApiResponse>) {
    if (this.createUpdateForm.invalid) return;
    this.isLoading.set(true);
    action
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response: GlobalApiResponse) => {
        this.closeDialog(response.data);
        if (!this.editData) {
          this.#dialogService.open(UnitTypesDialogComponent, {
            ...this.dialogConfigUnit,
            data: {
              project_id: response.data.id,
              purposes: response.data.purposes,
              method: 'create',
            },
          });
        }
      });
  }
}
