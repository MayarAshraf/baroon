import { ComponentType } from '@angular/cdk/portal';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import {
  BaseIndexComponent,
  LangService,
  TableWrapperComponent,
} from '@shared';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { ApplicantDialogComponent } from './applicant-dialog.component';
import { ApplicantModel } from './services/service-type';

@Component({
  selector: 'app-applicant',
  standalone: true,
  imports: [
    AsyncPipe,
    TranslateModule,
    TableWrapperComponent,
    FormsModule,
    DropdownModule,
  ],
  templateUrl: './applicant.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ApplicantComponent extends BaseIndexComponent<
  ApplicantModel,
  ComponentType<ApplicantDialogComponent>
> {
  currentLang = inject(LangService).currentLanguage;
  attachments = viewChild.required<TemplateRef<any>>('attachments');
  status = viewChild.required<TemplateRef<any>>('status');

  statusTypes = [
    {
      label: this.translate.instant(_('Pending')),
      value: 'Pending',
    },
    {
      label: this.translate.instant(_('Accepted')),
      value: 'Accepted',
    },
    {
      label: this.translate.instant(_('Rejected')),
      value: 'Rejected',
    },
  ];
  ngOnInit() {
    this.roles.set({
      ...this.roles(),
      update: false,
      create: false,
    });
    this.dialogComponent = ApplicantDialogComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: 'careers/applicants',
        delete: 'careers/applicants/delete',
      },
      indexTitle: this.translate.instant(_('Applicants')),
      createBtnLabel: this.translate.instant(_('Create Applicants')),
      indexIcon: 'fa-solid fa-user-tie',
      indexTableKey: 'APPLICANTS_KEY',
      columns: [
        {
          name: 'id',
          title: this.#translate(_('#ID')),
          searchable: false,
          orderable: false,
        },
        {
          name: `career.title_${this.currentLang()}`,
          title: this.#translate(_('Job Title')),
          searchable: true,
          orderable: false,
        },
        {
          name: `name`,
          title: this.#translate(_('name')),
          searchable: true,
          orderable: false,
        },
        {
          name: `email`,
          title: this.#translate(_('email')),
          searchable: true,
          orderable: false,
        },
        {
          name: `phone`,
          title: this.#translate(_('phone')),
          searchable: true,
          orderable: false,
        },
        {
          name: `status`,
          title: this.#translate(_('status')),
          searchable: true,
          orderable: false,
          render: this.status(),
        },
        {
          name: `attachments`,
          title: this.#translate(_('attachments')),
          searchable: false,
          orderable: false,
          render: this.attachments(),
        },
      ],
    };
  }

  changeStatus(id: number, event: DropdownChangeEvent) {
    this.api
      .request('post', 'careers/applicants/update', {
        status: event.value,
        id,
        _method: 'PUT',
      })
      .subscribe();
  }

  #translate(text: string) {
    return this.translate.instant(text);
  }
}
