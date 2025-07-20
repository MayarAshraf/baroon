import { ComponentType } from '@angular/cdk/portal';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import {
  BaseIndexComponent,
  LangService,
  TableWrapperComponent,
} from '@shared';
import { CompanyDialogComponent } from './company-dialog.component';
import { Company } from './services/service-type';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [AsyncPipe, TranslateModule, TableWrapperComponent],
  templateUrl:
    '/src/app/shared/components/basic-crud/base-index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CompaniesComponent extends BaseIndexComponent<
  Company,
  ComponentType<CompanyDialogComponent>
> {
  currentLang = inject(LangService).currentLanguage;
  ngOnInit() {
    this.dialogComponent = CompanyDialogComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: 'sister_companies',
        delete: 'sister_companies/delete',
      },
      indexTitle: this.translate.instant(_('Sister Company')),
      createBtnLabel: this.translate.instant(_('Sister Company')),
      indexIcon: 'fa-solid fa-boxes-stacked',
      indexTableKey: 'COMPANIES_KEY',
      columns: [
        {
          name: 'id',
          title: this.#translate(_('#ID')),
          searchable: false,
          orderable: false,
        },
        {
          name: `name_${this.currentLang()}`,
          title: this.#translate(_('title')),
          searchable: true,
          orderable: false,
        },
      ],
    };
  }

  #translate(text: string) {
    return this.translate.instant(text);
  }
}
