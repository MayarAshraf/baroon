import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'formly-editor-field',
  template: `
    <div class="p-field">
      @if (props.label) {
      <label>
        {{ props.label }}
        @if (props.required && props.hideRequiredMarker !== true) {
        <span class="text-red-500">*</span>
        }
      </label>
      } @if (props.description) {
      <p class="mt-1 font-medium text-xs text-primary">
        {{ props.description }} <i class="pi pi-info-circle text-sm"></i>
      </p>
      }

      <quill-editor
        [formControl]="formControl"
        [formlyAttributes]="field"
        [placeholder]="props.placeholder ?? ''"
        [style]="{ height: '400px', width: '100%' }"
      ></quill-editor>

      @if (showError && formControl.errors) {
      <small class="p-error" role="alert">
        <formly-validation-message [field]="field"></formly-validation-message>
      </small>
      }
    </div>
  `,
  standalone: true,
  imports: [QuillModule, FormlyModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent extends FieldType<FieldTypeConfig> {}
