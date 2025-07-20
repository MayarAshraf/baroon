import { ComponentType } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import {
  BaseIndexComponent,
  BreadcrumbService,
  ConfirmButtonComponent,
  LangService,
  TableWrapperComponent,
} from '@shared';
import { ButtonModule } from 'primeng/button';
import { filter, map, tap } from 'rxjs';
import { lookup } from '../services/service-type';
import { LookupsChildDialogComponent } from './lookups-child-dialog.component';

@Component({
  selector: 'app-lookups-child',
  standalone: true,
  imports: [
    TranslateModule,
    TableWrapperComponent,
    ConfirmButtonComponent,
    ButtonModule,
  ],
  templateUrl: './lookups-child.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LookupsChildComponent extends BaseIndexComponent<
  lookup,
  ComponentType<LookupsChildDialogComponent>
> {
  currentLang = inject(LangService).currentLanguage;
  slug = input<string>('');
  parent_id = input<number>(0);
  #breadcrumbService = inject(BreadcrumbService);

  records$ = toObservable(this.records).pipe(
    filter((records) => records != null),
    map((records) => records),
    tap((records) => {
      const firstParentName = records[0]?.parent[`name_${this.currentLang()}`];
      this.#breadcrumbService.updateAllBreadcrumbs([
        {
          label: this.#translate(_('lookups')),
          url: `/lookups`,
        },
        {
          label: firstParentName,
          url: `/lookups/${this.slug()}/${this.parent_id()}`,
        },
      ]);
    }),
    takeUntilDestroyed(this.destroyRef),
  );
  recordsReadOnly = toSignal(this.records$, { initialValue: [] });

  ngOnInit() {
    this.dialogComponent = LookupsChildDialogComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: `lookups/by-parent-slug-table/${this.slug()}`,
        delete: 'lookups/lookup/delete',
      },
      indexTitle: this.translate.instant(_('Lookups')),
      createBtnLabel: this.translate.instant(_('Create Lookup')),
      indexIcon: 'fa-solid fa-warehouse',
      indexTableKey: 'LOOKUPS_CHILD_KEY',
      columns: [
        {
          name: 'id',
          title: this.#translate(_('#ID')),
          searchable: false,
          orderable: false,
        },
        {
          name: 'order',
          title: this.#translate(_('order')),
          searchable: false,
          orderable: false,
        },
        {
          name: `name_${this.currentLang()}`,
          title: this.#translate(_('name')),
          searchable: true,
          orderable: false,
        },
      ],
    };
  }

  override openCreateRecordDialog() {
    const dialogConfigOptions = {
      ...this.dialogConfig,
      data: { parent_id: this.parent_id(), method: 'create' },
    };
    this.dialogRef = this.dialogService.open(
      this.dialogComponent,
      dialogConfigOptions,
    );
    this.dialogRef.onClose
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((record) => {
        if (!record) return;
        this.records.update((records) => {
          if (record.is_default === 1) {
            return [
              record,
              ...records.map((item) => ({
                ...item,
                is_default: item.id === record.id ? 1 : 0,
              })),
            ];
          }
          return [record, ...records];
        });
        this.totalRecords.update((totalRecords) => totalRecords + 1);
        this.recordsFiltered.update((recordsFiltered) => recordsFiltered + 1);
        this.actionCrement.set(1);
      });
  }

  override openUpdateRecordDialog(model: lookup) {
    const dialogConfig = { ...this.dialogConfig, data: model };
    this.dialogRef = this.dialogService.open(
      this.dialogComponent,
      dialogConfig,
    );
    this.dialogRef.onClose
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((record) => {
        if (!record) return;
        this.records.update((records) => {
          if (record.is_default === 1) {
            return records.map((item) =>
              item.id === record.id
                ? { ...item, ...record, is_default: 1 }
                : { ...item, is_default: 0 },
            );
          }
          return records.map((item) =>
            item.id === record.id ? { ...item, ...record } : item,
          );
        });

        this.records.update((records) => [...records]);
      });
  }

  #translate(text: string) {
    return this.translate.instant(text);
  }
}
