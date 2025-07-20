import { ComponentType } from '@angular/cdk/portal';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import {
  AuthService,
  BaseIndexComponent,
  ConfirmButtonComponent,
  LangService,
  TableWrapperComponent,
  User,
} from '@shared';
import { ButtonModule } from 'primeng/button';
import { UserDialogComponent } from './user-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    AsyncPipe,
    TranslateModule,
    TableWrapperComponent,
    ConfirmButtonComponent,
    ButtonModule,
  ],
  templateUrl: './user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersComponent extends BaseIndexComponent<
  User,
  ComponentType<UserDialogComponent>
> {
  currentLang = inject(LangService).currentLanguage;
  currentUser = inject(AuthService).currentUser;
  ngOnInit() {
    this.dialogComponent = UserDialogComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: { index: 'auth/users/user', delete: 'auth/users/user/delete' },
      indexTitle: this.translate.instant(_('Users')),
      indexIcon: 'fa-solid fa-user',
      createBtnLabel: this.translate.instant(_('Create Users')),
      indexTableKey: 'USER_KEY',
      columns: [
        {
          name: 'id',
          title: this.#translate(_('#ID')),
          searchable: false,
          orderable: false,
        },
        {
          name: 'first_name',
          title: this.#translate(_('first name')),
          searchable: true,
          orderable: false,
        },
        {
          name: 'last_name',
          title: this.#translate(_('last name')),
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
          name: 'phone',
          title: this.#translate(_('phone')),
          searchable: true,
          orderable: false,
        },
        {
          name: 'role_slug',
          title: this.#translate(_('role')),
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
