import {
  DatePipe,
  DecimalPipe,
  JsonPipe,
  LowerCasePipe,
  NgClass,
  NgTemplateOutlet,
  SlicePipe,
  UpperCasePipe,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Output,
  TemplateRef,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  NestedPropertyPipe,
  RangePipe,
  RolesVisibilityDirective,
  TimeZonePipe,
} from '@shared';
import { NgxTranslateCutModule } from 'ngx-translate-cut';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableModule, TableService } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { constants } from '../../../config';
import { DataTableColumn, LangService } from '../../../services';
import { ConfirmButtonComponent } from '../../confirm-button.component';
import { IconComponent } from '../../icon.component';

export function tableFactory(table: TableWrapperComponent): Table {
  return table.primengTable();
}
@Component({
  selector: 'app-table-wrapper',
  templateUrl: './table-wrapper.component.html',
  styleUrls: ['./table-wrapper.component.scss'],
  providers: [
    DecimalPipe,
    TableService,
    {
      provide: Table,
      useFactory: tableFactory,
      deps: [TableWrapperComponent],
    },
  ],
  standalone: true,
  imports: [
    NgTemplateOutlet,
    JsonPipe,
    SlicePipe,
    NgClass,
    RangePipe,
    IconComponent,
    TimeZonePipe,
    SkeletonModule,
    InputTextModule,
    NestedPropertyPipe,
    CardModule,
    DatePipe,
    UpperCasePipe,
    LowerCasePipe,
    DividerModule,
    ButtonModule,
    ImageModule,
    ChipModule,
    TranslateModule,
    NgxTranslateCutModule,
    TableModule,
    ConfirmButtonComponent,
    RolesVisibilityDirective,
    TranslateModule,
    TooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableWrapperComponent {
  currentLang = inject(LangService).currentLanguage;
  #translate = inject(TranslateService);
  #decimalPipe = inject(DecimalPipe);

  constants = constants;
  @ContentChild('additionalContentTemplate')
  additionalContentTemplate!: TemplateRef<any>;
  @ContentChild('customFiltersTemplate')
  customFiltersTemplate!: TemplateRef<any>;
  @ContentChild('headerTemplate') headerTemplate!: TemplateRef<any>;
  @ContentChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ContentChild('extendDefaultActionsTemplate')
  extendDefaultActionsTemplate!: TemplateRef<any>;
  @ContentChild('bodyTemplate') bodyTemplate!: TemplateRef<any>;
  @ContentChild('expandedRowTemplate') expandedRowTemplate!: TemplateRef<any>;
  primengTable = viewChild.required<Table>('primengTable');

  showCurrentPageReport = input(true);
  withTableHeader = input(true);
  withScreenHeader = input(true);
  withCustomFilters = input(false);
  withActionsColumn = input(true);
  displayHeaderButton = input(true);
  indexRole = input<boolean>(true);
  createBtnRole = input<boolean>(true);
  updateBtnRole = input<boolean>(true);
  deleteBtnRole = input<boolean>(true);
  lazyLoadOnInit = input(true);
  withResetButton = input(true);
  headerTitle = input<string>('');
  titleIcon = input<string>('');
  titleClass = input<string>('');
  lazy = input(true);
  headerBtnLabel = input<string>('');
  alwaysShowPaginator = input(true);
  withAdditionalContent = input(false);

  @Output() createBtnClicked = new EventEmitter();
  @Output() updateBtnClicked = new EventEmitter();
  @Output() deleteBtnClicked = new EventEmitter();
  @Output() deleteBtnForceClicked = new EventEmitter();
  @Output() onStateSave = new EventEmitter();
  @Output() onStateRestore = new EventEmitter();

  dataSource = input<any[]>([]);
  columns = input<DataTableColumn[]>([]);
  reorderableColumns = input(false);
  reorderableRows = input(false);
  responsiveLayout = input('scroll');
  dataKey = input('id');
  stateKey = input<string | undefined>(undefined);
  rowExpandMode = input<'single' | 'multiple'>('single');
  totalRecords = input<number>(0);
  recordsFiltered = input<number>();
  editMode = input<'cell' | 'row'>('cell'); // "cell" | "row"
  rowHover = input(true);
  rows = input(constants.TABLE_ROWS_LENGTH);
  loading = input(false);
  paginator = input(true);
  paginatorPosition = input<'both' | 'top' | 'bottom'>('bottom');
  globalFilterFields = input<string[]>([]);
  globalFilterValue = input<string | null>(null);
  isMultiSelections = input(false);
  selectionMode = input<'single' | 'multiple' | null>(null); // "single" | "multiple"
  selection: any = input();
  rowsPerPageOptions = input<number[] | undefined>([5, 10, 20, 30, 50, 100]);
  withTableFilters = input(true);
  showGridlines = input(true);
  showStriped = input(true);
  styleClass = input<string>('');

  @Output() onLoadData = new EventEmitter();
  @Output() selectionChange = new EventEmitter();
  @Output() selectAllChange = new EventEmitter();
  @Output() editComplete = new EventEmitter();
  @Output() columnSortChange = new EventEmitter();
  @Output() onRowReorder = new EventEmitter();

  #formatNumber(num: number | undefined): string {
    return this.#decimalPipe.transform(num, '1.0-0') || '';
  }

  currentPageReport = computed(() => {
    const filteredFrom = this.globalFilterValue()
      ? ` (${this.#translate.instant(_('filtered from'))} ${this.#formatNumber(
          this.totalRecords()
        )} ${this.#translate.instant(_('total entries'))})`
      : '';

    const showing = this.#translate.instant(_('showing'));
    const toRecords = this.#translate.instant(_('to'));
    const ofRecords = this.#translate.instant(_('of'));

    const first = '{first}';
    const last = '{last}';

    return !this.loading()
      ? `${showing} ${first} ${toRecords} ${last} ${ofRecords} ${this.#formatNumber(
          this.totalRecords()
        )} ${this.#translate.instant(_('entries'))} ${filteredFrom}`
      : '';
  });

  getTableClass() {
    return `
      p-datatable-sm text-sm
      ${this.styleClass}
      ${this.showGridlines() ? 'p-datatable-gridlines' : ''}
      ${this.showStriped() ? 'p-datatable-striped' : ''}
    `;
  }

  resetTable() {
    this.primengTable().reset();
    this.primengTable().clearState();
    this.selectionChange.emit([]);
  }
}
