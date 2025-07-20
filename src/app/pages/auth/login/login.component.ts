import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  AlertService,
  AuthService,
  FormComponent,
  LoginModel,
  constants,
} from '@shared';
import { MessageModule } from 'primeng/message';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [MessageModule, TranslateModule, RouterLink, FormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  #activatedRoute = inject(ActivatedRoute);
  #authService = inject(AuthService);
  #alert = inject(AlertService);
  #router = inject(Router);
  #translate = inject(TranslateService);
  #destroyRef = inject(DestroyRef); // Current "context" (this component)

  returnUrl!: string;
  loading = signal(false);
  model: LoginModel = {} as LoginModel;
  loginForm = new FormGroup({});

  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      className: 'shadow-none',
      props: {
        required: true,
        placeholder: this.#translate.instant(_('example@gmail.com')),
      },
      validators: {
        validation: ['email'],
      },
    },
    {
      key: 'password',
      type: 'password-field',
      className: 'shadow-none',
      props: {
        required: true,
        placeholder: '********',
        toggleMask: true,
        minLength: constants.MIN_LENGTH_TEXT_INPUT,
      },
    },
  ];

  ngOnInit(): void {
    // the queryParams observable is used to get the value of the returnUrl and state parameters from the AuthGuard.
    this.#activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((params) => {
        this.returnUrl =
          params['returnUrl'] || constants.LOGIN_SUCCESS_REDIRECT_URL;
        this.#alert.setMessage({
          severity: 'error',
          detail: params['message'] ?? '',
        });
      });
  }

  login(): void {
    if (this.loginForm.invalid) return; // return early
    this.loading.set(true);
    this.#authService
      .login(this.model)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: () => {
          this.#router.navigateByUrl(this.returnUrl);
        },
      });
  }
}
