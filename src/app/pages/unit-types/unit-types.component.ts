import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import {
  BaseIndexComponent,
  LangService,
  TableWrapperComponent,
} from '@shared';
import { UnitTypes } from './services/service-type';
import { UnitTypesDialogComponent } from './unit-types-dialog.component';

@Component({
  selector: 'app-unit-types',
  standalone: true,
  imports: [TranslateModule, TableWrapperComponent],
  templateUrl:
    '/src/app/shared/components/basic-crud/base-index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UnitTypesComponent extends BaseIndexComponent<
  UnitTypes,
  ComponentType<UnitTypesDialogComponent>
> {
  currentLang = inject(LangService).currentLanguage;
  ngOnInit() {
    this.roles.set({
      ...this.roles(),
      create: false,
    });
    this.dialogComponent = UnitTypesDialogComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: 'inventory/unit-types',
        delete: 'inventory/unit-types/delete',
      },
      createBtnLabel: this.translate.instant(_('Create Unit Type')),
      indexTitle: this.translate.instant(_('unit types')),
      indexIcon: 'fa-solid fa-sitemap',
      indexTableKey: 'UNITTYPES_KEY',
      columns: [
        {
          title: this.#translate(_('order')),
          name: 'order',
          searchable: true,
          orderable: false,
        },
        {
          title: this.#translate(_('name')),
          name: `name_${this.currentLang()}`,
          searchable: true,
          orderable: false,
        },
        {
          title: this.#translate(_('down payment')),
          name: 'down_payment',
          searchable: true,
          orderable: false,
        },
        {
          title: this.#translate(_('installments year from')),
          name: 'number_of_installments_years_from',
          searchable: true,
          orderable: false,
        },
        {
          title: this.#translate(_('installments year to')),
          name: 'number_of_installments_years_to',
          searchable: true,
          orderable: false,
        },
        {
          title: this.#translate(_('price from')),
          name: 'price_from',
          searchable: true,
          orderable: false,
        },
        {
          title: this.#translate(_('price to')),
          name: 'price_to',
          searchable: true,
          orderable: false,
        },
        {
          title: this.#translate(_('area from')),
          name: 'area_from',
          searchable: false,
          orderable: false,
        },
        {
          title: this.#translate(_('area to')),
          name: 'area_to',
          searchable: true,
          orderable: false,
        },
        {
          title: this.#translate(_('created at')),
          name: 'created_at',
          searchable: false,
          orderable: false,
          transform: { type: 'date', filter: 'MMM d, y' },
        },
      ],
    };
  }

  #translate(text: string) {
    return this.translate.instant(text);
  }
}
