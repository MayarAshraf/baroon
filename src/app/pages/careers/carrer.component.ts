import { ComponentType } from '@angular/cdk/portal';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import {
  BaseIndexComponent,
  LangService,
  TableWrapperComponent,
} from '@shared';
import { ButtonModule } from 'primeng/button';
import { CareerDialogComponent } from './career-dialog.component';
import { Career } from './services/service-type';

@Component({
  selector: 'app-sliders',
  standalone: true,
  imports: [
    AsyncPipe,
    TranslateModule,
    TableWrapperComponent,
    ButtonModule,
    RouterLink,
  ],
  templateUrl: './carrer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SlidersComponent extends BaseIndexComponent<
  Career,
  ComponentType<CareerDialogComponent>
> {
  currentLang = inject(LangService).currentLanguage;
  ngOnInit() {
    this.dialogComponent = CareerDialogComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: 'careers/careers',
        delete: 'careers/careers/delete',
      },
      indexTitle: this.translate.instant(_('Career')),
      createBtnLabel: this.translate.instant(_('Create Career')),
      indexIcon: 'fa-solid fa-user-tie',
      indexTableKey: 'CAREER_KEY',
      columns: [
        {
          name: 'id',
          title: this.#translate(_('#ID')),
          searchable: false,
          orderable: false,
        },
        {
          name: `title_${this.currentLang()}`,
          title: this.#translate(_('title')),
          searchable: true,
          orderable: false,
        },
        {
          name: 'type',
          title: this.#translate(_('type')),
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
