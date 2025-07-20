import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { ApiService, LangService } from '@shared';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs';

@Component({
  selector: 'formly-autocomplete-field',
  template: `
    <div class="p-field">
      @if (props.label) {
      <label>
        {{ props.label }}
        @if (props.required && props.hideRequiredMarker !== true) {
        <span class="text-red-500">*</span>
        }
      </label>
      }

      <p-autoComplete
        styleClass="w-full"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [class.ng-dirty]="showError"
        [forceSelection]="true"
        [delay]="1000"
        inputStyleClass="w-full text-sm"
        [dropdown]="props.dropdown ?? false"
        [multiple]="props.multiple"
        [placeholder]="props.placeholder ?? ''"
        [required]="props.required ?? false"
        [showClear]="props.showClear"
        [suggestions]="suggestions()"
        (completeMethod)="onComplete($event)"
        (onClear)="field.form?.get(this.props.fieldKey)?.setValue(null)"
      />

      @if (props.description) {
      <p class="mt-3 text-xs">{{ props.description }}</p>
      } @if (showError && formControl.errors) {
      <small class="p-error" role="alert">
        <formly-validation-message [field]="field"></formly-validation-message>
      </small>
      }
    </div>
  `,
  standalone: true,
  imports: [AutoCompleteModule, FormlyModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent extends FieldType<FieldTypeConfig> {
  #destroyRef = inject(DestroyRef);
  #currentLang = inject(LangService).currentLanguage;
  #api = inject(ApiService);
  suggestions = signal<{ label: string; value: number }[]>([]);

  onComplete(event: AutoCompleteCompleteEvent) {
    this.#api
      .request('post', this.props.endpoint, {
        key: event.query,
      })
      .pipe(
        map(({ data }) => data),
        map((data) => {
          const list = data.map((item: any) => ({
            label: item[`${this.props.labelTarget}_${this.#currentLang()}`],
            value: item.id,
          }));
          return list;
        }),
        debounceTime(1000),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((data) => this.suggestions.set(data));
  }

  ngOnInit() {
    this.formControl.valueChanges
      .pipe(
        filter((value) => !!value),
        distinctUntilChanged(),
        takeUntilDestroyed(this.#destroyRef),
        tap((value) => {
          const newValue = this.props.multiple
            ? value.map((i: { value: number }) => i.value)
            : value.value;
          this.field.form?.get(this.props.fieldKey)?.setValue(newValue);
        })
      )
      .subscribe();
  }
}
