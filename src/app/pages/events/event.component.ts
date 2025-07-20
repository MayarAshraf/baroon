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
import { EventDialogComponent } from './event-dialog.component';
import { Event } from './services/service-type';
@Component({
  selector: 'app-sliders',
  standalone: true,
  imports: [AsyncPipe, TranslateModule, TableWrapperComponent],
  templateUrl:
    '/src/app/shared/components/basic-crud/base-index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EventComponent extends BaseIndexComponent<
  Event,
  ComponentType<EventDialogComponent>
> {
  currentLang = inject(LangService).currentLanguage;
  ngOnInit() {
    this.dialogComponent = EventDialogComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: { index: 'events', delete: 'events/delete' },
      indexTitle: this.translate.instant(_('Event')),
      createBtnLabel: this.translate.instant(_('Create Event')),
      indexIcon: 'fa-solid fa-calendar-days',
      indexTableKey: 'EVENT_KEY',
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
      ],
    };
  }

  #translate(text: string) {
    return this.translate.instant(text);
  }
}
