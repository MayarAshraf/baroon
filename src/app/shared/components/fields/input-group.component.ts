import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '@env';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-input-group',
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
      @if (props.description) {<p class="mb-3 text-xs">{{ props.description }}</p>}

      <div class="p-inputgroup">
        <input
          [type]="props.type || 'text'"
          pInputText
          class="w-auto flex-none shadow-none border-300"
          [disabled]="true"
          [value]="url"/>
        <input
          [type]="props.type || 'text'"
          pInputText
          class="shadow-none border-300"
          [formControl]="$any(formControl)"
          [formlyAttributes]="field"/>
      </div>

      @if (showError && formControl.errors) {
        <small class="p-error" role="alert">
          <formly-validation-message [field]="field"></formly-validation-message>
        </small>
      }
    </div>
  `,
  standalone: true,
  imports: [FormlyModule, InputTextModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputGroupComponent extends FieldType {
  url = environment.API_URL
}
