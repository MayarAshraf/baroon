import { ComponentType } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  model,
  signal,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { constants } from '../../config';
import {
  ApiService,
  BaseCrudIndexMeta,
  CachedListService,
  FiltersData,
  LangService,
} from '../../services';

interface Item {
  id?: number | null;
}

@Component({
  selector: 'app-base-index',
  template: '', // Placeholder template as it will not be directly used
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/*
Abstract classes don’t exist as part of the JavaScript language, they are a specific TypeScript feature. when we see the word abstract we never call that class directly - we only inherit from it. It is a naming convention given to a class in TypeScript that says "only inherit from me". If we call that class directly, TypeScript will throw an error and not let we as it is marked as abstract.
*/
export abstract class BaseIndexComponent<
  R extends Item,
  C extends ComponentType<unknown> = ComponentType<unknown>,
  M extends object = { [key in keyof Partial<R>]: any },
> {
  public api = inject(ApiService);
  public translate = inject(TranslateService);
  public langService = inject(LangService);
  public destroyRef = inject(DestroyRef); // Current "context" (this component)
  public dialogService = inject(DialogService);
  public dialogRef: DynamicDialogRef | undefined;
  public actionCrement = signal<number>(0);
  public cacheList = inject(CachedListService);

  // Common properties used by all specific components
  records = model<R[]>([]);
  totalRecords = model<number>(0);
  recordsFiltered = model<number>(0);
  globalFilterValue: string | null = null;
  isLoading = model(true);
  filtersData = signal<FiltersData>({} as FiltersData);
  indexMeta = new BaseCrudIndexMeta();
  dialogComponent!: C;
  roles = signal<{ [key: string]: boolean }>({
    index: true,
    create: true,
    update: true,
    delete: true,
  });

  loadRecords$ = toObservable(this.filtersData).pipe(
    filter(() => Object.keys(this.filtersData()).length > 0),
    tap(() => this.isLoading.set(true)),
    switchMap((filters) =>
      this.api.request('post', this.indexMeta.endpoints.index, filters).pipe(
        map(({ data }) => data),
        map((data) => {
          return {
            data: data.data.map((record: any) => record.record),
            recordsTotal: data.recordsTotal,
            recordsFiltered: data.recordsFiltered,
          };
        }),
        tap((data) => {
          this.records.set(data.data);
          this.totalRecords.set(data.recordsTotal);
          this.recordsFiltered.set(data.recordsFiltered);
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          return of({}); // Empty object as a fallback because ToSignal when subscribe always want good value
        }),
      ),
    ),
  );

  loadRecordsReadOnly = toSignal(this.loadRecords$, { initialValue: {} });

  // Common methods for CRUD operations
  protected loadRecords(
    event: LazyLoadEvent,
    setFiltersOnInit: { [key: string]: any } = {},
  ) {
    this.isLoading.set(true);
    this.globalFilterValue = event.globalFilter;

    const column = this.indexMeta.columns?.findIndex(
      (c) => c.name === event.sortField,
    );
    const sortOrder = column !== -1 ? (event.sortOrder ?? 1) * -1 : 1;

    this.filtersData.update((oldFilters) => {
      return {
        ...oldFilters,
        ...setFiltersOnInit,
        length: event.rows || constants.TABLE_ROWS_LENGTH,
        start: event.first || 0,
        search: { value: this.globalFilterValue, regex: false },
        columns: this.indexMeta.columns.map(
          ({ render, trans, transform, ...col }) => col,
        ), // create new array without the "render" property,
        order: [
          {
            column: column !== -1 ? column : 1,
            dir: sortOrder === 1 ? 'asc' : 'desc',
          },
        ],
        _method: 'GET',
      };
    });
  }

  protected dialogConfig: DynamicDialogConfig<M> = {
    showHeader: false,
    width: '800px',
    height: '100%',
    modal: true,
    focusOnShow: true,
    styleClass: 'm-0 max-h-full transform-none',
    position: this.langService.currentLanguage() === 'en' ? 'right' : 'left',
    rtl: this.langService.currentLanguage() !== 'en',
    closable: true,
    closeOnEscape: true,
    dismissableMask: false,
  };

  protected openCreateRecordDialog(dialogConfig?: DynamicDialogConfig) {
    const dialogConfigOptions = dialogConfig ? dialogConfig : this.dialogConfig;
    this.dialogRef = this.dialogService.open(
      this.dialogComponent,
      dialogConfigOptions,
    );
    this.dialogRef.onClose
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((record) => {
        if (!record) return;
        this.records.update((records) => [record, ...records]);
        this.totalRecords.update((totalRecords) => totalRecords + 1);
        this.recordsFiltered.update((recordsFiltered) => recordsFiltered + 1);
        this.actionCrement.set(1);
      });
  }

  protected openUpdateRecordDialog(model: M) {
    const dialogConfig = { ...this.dialogConfig, data: model };
    this.dialogRef = this.dialogService.open(
      this.dialogComponent,
      dialogConfig,
    );
    this.dialogRef.onClose
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((record) => {
        if (!record) return;
        this.records.update((records) =>
          records.map((item) =>
            item.id === record.id ? { ...item, ...record } : item,
          ),
        );
      });
  }

  protected deleteRecord(record: R) {
    this.api
      .request('delete', this.indexMeta.endpoints.delete, { id: record.id })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.records.update((records) =>
          records.filter((i) => i.id !== record.id),
        );
        this.totalRecords.update((totalRecords) => totalRecords - 1);
        this.recordsFiltered.update((recordsFiltered) => recordsFiltered - 1);
        this.actionCrement.set(-1);
      });
  }
}

/*
The "protected" access modifier in "OOP" allows class members to be accessed within the class itself and its subclasses. It provides encapsulation by restricting access to unrelated code outside of the class hierarchy.

The diff between protected and private access modifiers.

"protected": Members are accessible within the class that defines them and its subclasses. They are not accessible to code outside of the class hierarchy. "protected" members allow subclasses to inherit and use them.

"private": Members are only accessible within the class that defines them. They cannot be accessed by any code outside of the class, including subclasses. "private" members are used for internal implementation details and are not visible or accessible to other classes or instances.
*/
