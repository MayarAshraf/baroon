import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { LookupsService } from '@pages/lookups/services/lookups.service';
import {
  BaseCreateUpdateComponent,
  FieldBuilderService,
  FormComponent,
  LangService,
  SpinnerComponent,
} from '@shared';
import { ButtonModule } from 'primeng/button';
import { map } from 'rxjs';
import { UserModel } from './services/service-type';

@Component({
  selector: 'app-user-dialog',
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
export class UserDialogComponent extends BaseCreateUpdateComponent<UserModel> {
  #fieldBuilder = inject(FieldBuilderService);
  #lookups = inject(LookupsService);
  #currentLang = inject(LangService).currentLanguage;

  ngOnInit() {
    this.dialogMeta = {
      ...this.dialogMeta,
      dialogData$: this.#lookups.getLookupsList('user_roles'),
      endpoints: {
        store: 'auth/users/user',
        update: 'auth/users/user/update',
      },
    };

    if (this.editData) {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Update User')),
        submitButtonLabel: this.translate.instant(_('Update User')),
      };
      this.model = new UserModel(this.editData);
    } else {
      this.dialogMeta = {
        ...this.dialogMeta,
        dialogTitle: this.translate.instant(_('Create User')),
        submitButtonLabel: this.translate.instant(_('Create User')),
      };
    }
    this.#updateFields();
  }

  #updateFields() {
    this.fields = this.configureFields();
  }

  configureFields(): FormlyFieldConfig[] {
    return [
      this.#fieldBuilder.fieldBuilder([
        {
          key: 'first_name',
          type: 'floated-input-field',
          props: {
            required: true,
            label: _('first name'),
          },
        },
        {
          key: 'last_name',
          type: 'floated-input-field',
          props: {
            required: true,
            label: _('last name'),
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: 'username',
          type: 'floated-input-field',
          props: {
            label: _('Username'),
            placeholder: 'Enter Username',
            required: true,
          },
        },
        {
          key: 'email',
          type: 'floated-input-field',
          props: {
            label: _('E-mail'),
            required: true,
          },
          validators: {
            validation: ['email'],
          },
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          validators: {
            validation: [
              {
                name: 'fieldMatch',
                options: { errorPath: 'password_confirmation' },
              },
            ],
          },
          fieldGroup: [
            this.#fieldBuilder.fieldBuilder([
              {
                key: 'password',
                type: 'password-field',
                props: {
                  label: _('password'),
                  placeholder: _('password'),
                  toggleMask: true,
                  required: !this.editData,
                },
              },
              {
                key: 'password_confirmation',
                type: 'password-field',
                props: {
                  label: _('password confirmation'),
                  placeholder: _('password confirmation'),
                  toggleMask: true,
                  required: !this.editData,
                },
              },
            ]),
          ],
        },
      ]),
      this.#fieldBuilder.fieldBuilder([
        {
          key: 'role_id',
          type: 'select-field',
          className: 'col-12 md:col-6',
          props: {
            isFloatedLabel: true,
            label: _('Roles'),
            optionLabel: 'label',
            required: true,
            optionValue: 'id',
            options: this.#lookups.getLookupsList('user_roles').pipe(
              map((data) =>
                data.map((item: any) => ({
                  label: item[`name_${this.#currentLang()}`],
                  id: item.id,
                }))
              )
            ),
          },
        },
        {
          key: 'phone',
          type: 'floated-input-field',
          props: {
            type: 'number',
            label: _('phone'),
            min: 0,
          },
          validators: {
            validation: ['phone'],
          },
        },
      ]),
    ];
  }
}
