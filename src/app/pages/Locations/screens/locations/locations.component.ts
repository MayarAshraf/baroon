import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { LocationsBreadCrumbService } from '@pages/Locations/services/locations-breadcrumbs.service';
import {
  BaseIndexComponent,
  BreadcrumbItem,
  BreadcrumbService,
  LangPropPipe,
  LangService,
  TableWrapperComponent,
} from '@shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { filter, scan, switchMap, tap } from 'rxjs';
import { Location } from '../../services/service-types';
import { LocationDialogComponent } from './location-dialog.component';
@Component({
  selector: 'app-index-locations',
  standalone: true,
  templateUrl: './locations.component.html',
  imports: [
    AsyncPipe,
    ButtonModule,
    RouterLink,
    LangPropPipe,
    TableWrapperComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexLocationsComponent extends BaseIndexComponent<Location> {
  parent_id = input<number>(0);
  locationName = viewChild.required<TemplateRef<any>>('locationName');
  editData!: { id: number; method: 'create' | 'update' };
  stateKey!: string;
  lazyLoadEvent = signal<LazyLoadEvent | undefined>(undefined);
  locationsTable = viewChild<TableWrapperComponent>('locationsTable');
  currentLang = inject(LangService).currentLanguage;
  #breadcrumbService = inject(BreadcrumbService);
  #locationsBreadCrumb = inject(LocationsBreadCrumbService);

  initialBreadcrumb: BreadcrumbItem[] = [
    { label: 'location', url: '/locations' },
  ];

  LoadId$ = toObservable(this.parent_id).pipe(
    filter((e) => !!e),
    tap((id) => {
      this.locationsTable()?.resetTable();
      this.lazyLoadEvent.set({} as LazyLoadEvent);
      this.loadRecords({} as LazyLoadEvent, { parent_id: +id });
      this.editData = { id: +id, method: 'create' };
      this.dialogConfig = { ...this.dialogConfig, data: this.editData };
    }),
    switchMap((id) => {
      return this.#locationsBreadCrumb.getLabelBreadCrumb(+id).pipe(
        tap((data) => {
          const currentAcess =
            this.currentLang() === 'ar' ? 'name_ar' : 'name_en';
          const breadcrumbs = data.map(
            (item: { name_en: string; name_ar: string; id: number }) => ({
              label: item[`${currentAcess}`],
              url: '/locations/' + item.id,
            })
          );
          const updatedBreadcrumbs = [
            ...this.initialBreadcrumb,
            ...breadcrumbs,
          ];
          this.#breadcrumbService.updateAllBreadcrumbs(updatedBreadcrumbs);
        }),
        takeUntilDestroyed(this.destroyRef)
      );
    })
  );
  LoadIdReadOnly = toSignal(this.LoadId$, { initialValue: 0 });

  lazyLoadEvent$ = toObservable(this.lazyLoadEvent).pipe(
    scan(
      (acc: any, curr) => {
        if (acc.parent_id === +this.parent_id()) {
          return {
            ...acc,
            filters: curr,
            initialLoadRecord: true,
          };
        } else {
          return {
            ...acc,
            parent_id: +this.parent_id(),
            initialLoadRecord: false,
          };
        }
      },
      {
        parent_id: undefined,
        filters: {},
        initialLoadRecord: false,
      }
    ),
    filter((state) => state.initialLoadRecord),
    tap(({ filters, parent_id }) => {
      this.loadRecords(filters, { parent_id: parent_id });
    })
  );
  lazyLoadEventReadOnly = toSignal(this.lazyLoadEvent$, { initialValue: {} });

  ngOnInit() {
    if (!this.parent_id()) {
      this.filtersData.update((oldFilterData) => {
        return {
          ...oldFilterData,
          is_parent: true,
        };
      });
    }
    this.dialogComponent = LocationDialogComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: 'locations/location',
        delete: 'locations/location/delete',
      },
      indexTitle: this.translate.instant(_('locations')),
      indexIcon: 'fas fa-location-dot',
      createBtnLabel: this.translate.instant(_('Create Location')),
      indexTableKey: undefined,
      columns: [
        {
          name: 'id',
          title: this.translate.instant(_('#ID')),
          searchable: false,
          orderable: false,
        },
        {
          name: 'order',
          title: this.translate.instant(_('order')),
          searchable: false,
          orderable: false,
        },
        {
          name: `name_${this.currentLang()}`,
          title: this.translate.instant(_('name')),
          searchable: true,
          orderable: false,
          render: this.locationName(),
        },
        {
          name: 'created_at',
          title: this.translate.instant(_('created at')),
          searchable: false,
          transform: { type: 'date', filter: 'MMM d, y' },
          orderable: false,
        },
      ],
    };
  }

  override openCreateRecordDialog() {
    super.openCreateRecordDialog(this.dialogConfig);
  }
}
