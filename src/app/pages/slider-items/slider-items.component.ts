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
import { sliderItems } from './services/service-type';
import { SliderItemsDialogComponent } from './slider-items-dialog.component';

@Component({
  selector: 'app-slider-items',
  standalone: true,
  imports: [AsyncPipe, TranslateModule, TableWrapperComponent],
  templateUrl:
    '/src/app/shared/components/basic-crud/base-index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SliderItemsComponent extends BaseIndexComponent<
  sliderItems,
  ComponentType<SliderItemsDialogComponent>
> {
  currentLang = inject(LangService).currentLanguage;
  ngOnInit() {
    this.dialogComponent = SliderItemsDialogComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: 'sliders/slider-items',
        delete: 'sliders/slider-items/delete',
      },
      indexTitle: this.translate.instant(_('Slider Items')),
      createBtnLabel: this.translate.instant(_('Create Slider Items')),
      indexIcon: 'fa-solid fa-image',
      indexTableKey: 'SLIDER_ITEMS_KEY',
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
          name: `title_${this.currentLang()}`,
          title: this.#translate(_('title')),
          searchable: true,
          orderable: false,
        },
        {
          name: `subtitle_${this.currentLang()}`,
          title: this.#translate(_('subtitle')),
          searchable: true,
          orderable: false,
        },
        {
          name: 'image',
          title: this.#translate(_('image')),
          searchable: false,
          orderable: false,
          transform: { type: 'image', width: 100, height: 100 },
        },
      ],
    };
  }

  #translate(text: string) {
    return this.translate.instant(text);
  }
}
