import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import { BaseIndexComponent, TableWrapperComponent } from '@shared';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Contact } from './service/service-type';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [AsyncPipe, TranslateModule, TableWrapperComponent, ButtonModule],
  templateUrl: './contacts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContactsComponent extends BaseIndexComponent<Contact> {
  uniteType = viewChild.required<TemplateRef<any>>('uniteType');
  message = viewChild.required<TemplateRef<any>>('message');
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  showMessage(message: string) {
    this.confirmationService.confirm({
      message: message,
      header: this.translate.instant(_('message')),
      icon: 'pi pi-envelope',
      acceptVisible: false,
      rejectVisible: false,
      rejectButtonStyleClass: 'p-button-text',
    });
  }

  ngOnInit() {
    this.roles.set({
      ...this.roles(),
      update: false,
      create: false,
    });
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: 'contacts/contact',
        delete: 'contacts/contact/delete',
      },
      indexTitle: this.translate.instant(_('Contacts')),
      indexIcon: 'fa-solid fa-envelopes-bulk',
      indexTableKey: 'CONTACTS_KEY',
      columns: [
        {
          name: 'id',
          title: this.#translate(_('#ID')),
          searchable: false,
          orderable: false,
        },
        {
          name: 'full_name',
          title: this.#translate(_('full name')),
          searchable: true,
          orderable: false,
        },
        {
          name: 'phone',
          title: this.#translate(_('phone')),
          searchable: true,
          orderable: false,
        },
        {
          name: 'email',
          title: this.#translate(_('email')),
          searchable: true,
          orderable: false,
        },
        {
          name: 'message',
          title: this.#translate(_('message')),
          render: this.message(),
          searchable: true,
          orderable: false,
        },
        {
          name: 'unit_types',
          title: this.#translate(_('Unit Types')),
          render: this.uniteType(),
          searchable: true,
          orderable: false,
        },
      ],
    };
  }

  getUnitTypes(rowData: any): string {
    return (
      rowData.unit_types?.map((unit: any) => unit.name_en).join(', ') || ''
    );
  }

  #translate(text: string) {
    return this.translate.instant(text);
  }
}
