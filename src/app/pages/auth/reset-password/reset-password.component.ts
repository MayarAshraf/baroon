import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  AuthService,
  FieldBuilderService,
  FormComponent,
  ResetModel,
} from '@shared';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormComponent, TranslateModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ResetPasswordComponent {
  @Input() token!: string;

  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef);
  #fieldBuilder = inject(FieldBuilderService);
  #router = inject(Router);

  loading = signal(false);
  resetForm = new FormGroup({});
  model: ResetModel = {} as ResetModel;

  fields: FormlyFieldConfig[] = [
    this.#fieldBuilder.fieldBuilder([
      {
        validators: {
          validation: [
            {
              name: 'fieldMatch',
              options: { errorPath: 'password_confirm' },
            },
          ],
        },
        fieldGroup: [
          this.#fieldBuilder.fieldBuilder([
            {
              key: 'password',
              type: 'password-field',
              props: {
                placeholder: 'auth.enter_password',
                toggleMask: true,
              },
            },
            {
              key: 'password_confirm',
              type: 'password-field',
              props: {
                placeholder: 'auth.enter_password',
                toggleMask: true,
              },
            },
          ]),
        ],
      },
    ]),
  ];

  resetPassword(): void {
    if (this.resetForm.invalid) return; // return early
    this.model = { ...this.model, token: this.token };
    this.loading.set(true);
    this.#authService
      .resetPassword(this.model)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: () => this.#router.navigateByUrl('/dashboard'),
      });
  }
}
