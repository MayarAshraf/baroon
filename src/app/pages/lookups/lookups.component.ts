import { ComponentType } from '@angular/cdk/portal';
import { AsyncPipe, LowerCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import {
  BaseIndexComponent,
  LangService,
  TableWrapperComponent,
} from '@shared';
import { LookupsDialogComponent } from './lookups-dialog.component';
import { lookup } from './services/service-type';

@Component({
  selector: 'app-lookups',
  standalone: true,
  imports: [
    AsyncPipe,
    TranslateModule,
    TableWrapperComponent,
    LowerCasePipe,
    RouterLink,
  ],
  templateUrl: './lookups.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LookupsComponent extends BaseIndexComponent<
  lookup,
  ComponentType<LookupsDialogComponent>
> {
  currentLang = inject(LangService).currentLanguage;
  lookupName = viewChild.required<TemplateRef<any>>('lookupName');

  ngOnInit() {
    this.roles.set({
      ...this.roles(),
      delete: false,
      update: false,
      create: false,
    });
    this.dialogComponent = LookupsDialogComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: { index: 'lookups/lookup', delete: 'lookups/lookup/delete' },
      indexTitle: this.translate.instant(_('Lookups')),
      createBtnLabel: this.translate.instant(_('Create Lookup')),
      indexIcon: 'fa-solid fa-warehouse',
      indexTableKey: 'LOOKUPS_KEY',
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
          name: `parent.name_${this.currentLang()}`,
          title: this.#translate(_('name')),
          searchable: true,
          orderable: false,
          render: this.lookupName(),
        },
      ],
    };
    this.filtersData.update((oldFilters) => ({
      ...oldFilters,
      is_parent: true,
    }));
  }

  #translate(text: string) {
    return this.translate.instant(text);
  }
}
