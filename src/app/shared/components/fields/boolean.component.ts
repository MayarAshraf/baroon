import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'formly-boolean-field',
  template: `
    <div class="p-field">
      <div class="field-checkbox">
        <p-checkbox
          [formControl]="formControl"
          [formlyAttributes]="field"
          [binary]="true"
          [required]="props.required ?? false"
          [label]="props.label"
          [trueValue]="props.trueValue ?? 1"
          [falseValue]="props.falseValue ?? 0"
          (onChange)="props.change && props.change(field, $event)">
        </p-checkbox>
      </div>

      @if (props.description) {<p class="mt-1 text-xs">{{ props.description }}</p>}

      @if (showError && formControl.errors) {
        <small class="p-error" role="alert">
          <formly-validation-message [field]="field"></formly-validation-message>
        </small>
      }
    </div>
  `,
  standalone: true,
  imports: [NgClass, AsyncPipe, FormlyModule, CheckboxModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BooleanComponent extends FieldType<FieldTypeConfig> { }
