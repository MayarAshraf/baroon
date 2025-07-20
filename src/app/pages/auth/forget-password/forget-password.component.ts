import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService, ForgetModel, FormComponent } from '@shared';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [FormComponent, TranslateModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ForgetPasswordComponent {
  #authService = inject(AuthService);
  #translate = inject(TranslateService);
  #destroyRef = inject(DestroyRef);

  loading = signal(false);
  message = signal('');

  forgetForm = new FormGroup({});
  model: ForgetModel = {} as ForgetModel;

  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      props: {
        required: true,
        placeholder: this.#translate.instant(_('example@gmail.com')),
      },
    },
  ];

  forgetPassword(): void {
    if (this.forgetForm.invalid) return; // return early
    this.loading.set(true);
    this.#authService
      .forgetPassword(this.model)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: () =>
          this.message.set(
            'your requerst is successfully please verify your Account to Reset Password',
          ),
      });
  }
}
