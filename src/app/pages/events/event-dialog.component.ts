import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { SlugInputService } from '@gService/slug-input.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  BaseCreateUpdateComponent,
  FieldBuilderService,
  FormComponent,
  SpinnerComponent,
  StaticDataService,
} from '@shared';
import { ButtonModule } from 'primeng/button';
import { EventModel } from './services/service-type';

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  templateUrl:
    '/src/app/shared/components/basic-crud/base-create-update/base-create-update.component.html',
  imports: [
    AsyncPipe,
    TranslateModule,
    ButtonModule,
    RouterLink,
    SpinnerComponent,
    FormComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDialogComponent extends BaseCreateUpdateComponent<EventModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #languages = inject(StaticDataService).languages;
  #slugField = inject(SlugInputService);

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      endpoints: {
        store: 'events',
        update: 'events/update',
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Update Event')),
        submitButtonLabel: this.translate.instant(_('Update Event')),
      };
      this.model = new EventModel(this.editData);
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Create Event')),
        submitButtonLabel: this.translate.instant(_('Create Event')),
      };
      this.model = new EventModel(this.editData);
    }
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      {
        type: 'tabs-field',
        fieldGroup: this.#languages.map((lang) => ({
          props: {
            label: `${lang.label} (${lang.value.toUpperCase()})`,
          },
          fieldGroup: this.#BuildLangFields(lang.value),
        })),
      },
      this.#fieldBuilder.fieldBuilder([
        this.#slugField.getSlugField(),
        {
          key: 'start_date',
          type: 'date-field',
          props: {
            showTime: true,
            hourFormat: '12',
            required: true,
            label: _('start date'),
          },
        },
        {
          key: 'end_date',
          type: 'date-field',
          props: {
            showTime: true,
            hourFormat: '12',
            required: true,
            label: _('end date'),
          },
        },
      ]),
      {
        key: 'event_video_iframe',
        type: 'repeat-field',
        props: {
          addBtnText: 'Add video Iframe',
          disabledRepeater: false,
        },
        fieldArray: {
          type: 'textarea-field',
          props: {
            type: 'textarea-field',
            label: _('video Iframe'),
          },
        },
      },
      {
        key: 'event_video_url',
        type: 'repeat-field',
        props: {
          addBtnText: 'Add video URL',
          disabledRepeater: false,
        },
        fieldArray: {
          type: 'floated-input-field',
          key: 'event_video_url',
          props: {
            type: 'floated-input-field',
            label: _('video url'),
          },
        },
      },
      {
        key: 'images',
        type: 'file-field',
        props: {
          fileLabel: _('Select images'),
          multiple: true,
        },
      },
    ];
  }

  #BuildLangFields(lang: string): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: `title_${lang}`,
          type: 'floated-input-field',
          props: {
            label: _(`title`),
            required: lang === 'en',
            placeholder: _(`title`),
          },
        },
        {
          key: `description_${lang}`,
          type: 'textarea-field',
          className: 'col-12',
          props: {
            label: _(`description`),
            placeholder: _(`description`),
            required: lang === 'en',
          },
        },
      ]),
    ];
  }
}
