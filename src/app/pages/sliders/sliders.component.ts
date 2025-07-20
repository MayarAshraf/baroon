import { ComponentType } from '@angular/cdk/portal';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import {
  BaseIndexComponent,
  LangService,
  TableWrapperComponent,
} from '@shared';
import { Slider } from './services/service-type';
import { SliderDialogComponent } from './slider-dialog.component';

@Component({
  selector: 'app-sliders',
  standalone: true,
  imports: [AsyncPipe, TranslateModule, TableWrapperComponent],
  templateUrl:
    '/src/app/shared/components/basic-crud/base-index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SlidersComponent extends BaseIndexComponent<
  Slider,
  ComponentType<SliderDialogComponent>
> {
  @ViewChild('image', { static: true }) Image!: TemplateRef<any>;

  currentLang = inject(LangService).currentLanguage;
  ngOnInit() {
    this.dialogComponent = SliderDialogComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: { index: 'sliders/slider', delete: 'sliders/slider/delete' },
      indexTitle: this.translate.instant(_('Slider')),
      createBtnLabel: this.translate.instant(_('Create Slider')),
      indexIcon: 'fa-solid fa-image',
      indexTableKey: 'SLIDER_KEY',
      columns: [
        {
          name: 'id',
          title: this.#translate(_('#ID')),
          searchable: false,
          orderable: true,
        },
        {
          name: `title_${this.currentLang()}`,
          title: this.#translate(_('title')),
          searchable: false,
          orderable: false,
        },
        {
          name: 'slug',
          title: this.#translate(_('slug')),
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
