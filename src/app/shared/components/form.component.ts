import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  FormlyFieldConfig,
  FormlyFormOptions,
  FormlyModule,
} from '@ngx-formly/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-form',

  template: `
    @if(fields().length) {
    <form
      class="px-3 pt-4"
      [formGroup]="form()"
      (ngSubmit)="onSubmit.emit(model())"
    >
      @if(detailsDialog().length){
      <div class="pb-4">
        <div class="grid">
          @for(item of detailsDialog(); track $index){
          <div class="col-6 py-0">
            <h5 class="my-1">
              {{ item.name }} : <span> {{ item.value }}</span>
            </h5>
          </div>
          }
        </div>
      </div>

      }

      <formly-form
        [model]="model()"
        [fields]="fields()"
        [form]="form()"
        [options]="options()"
      />

      @if (showFormActions()) {
      <div
        [ngClass]="
          'form-footer flex flex-wrap justify-content-end gap-2 ' +
          footerFormClass()
        "
      >
        @if (showCancelButton()) {
        <!-- <button
          pButton
          type="button"
          class="p-button-sm p-button-outlined p-button-secondary"
          [ngClass]="cancelButtonClass()"
          [label]="cancelButtonLabel()"
          (click)="onCancel().emit()"
        ></button> -->
        } @if (showResetButton()) {
        <button
          pButton
          pRipple
          type="button"
          class="p-button-sm p-button-secondary p-button-outlined"
          [ngClass]="resetButtonClass()"
          (click)="options().resetModel?.()"
          label="Clear"
        ></button>
        <!--In case we rely on "form().reset()" instead of "options().resetModel()", please note that if we call "reset" without an explicit value, its value reverts to its default value instead of "null".-->
        } @if (showSubmitButton()) {
        <button
          pButton
          pRipple
          class="p-button-sm  p-button-success"
          type="submit"
          [ngClass]="submitButtonClass()"
          [loading]="submitBtnLoading()"
          [label]="buttonLabel()"
        ></button>
        }
      </div>
      }
    </form>
    }
  `,
  styles: [
    `
      .form-footer {
        position: sticky;
        bottom: 0;
        z-index: 5;
        padding-bottom: 1rem;
        background-color: #fff;
        border-top: 1px solid #ced4da;
        padding-top: 1rem;
      }
    `,
  ],
  standalone: true,
  imports: [NgClass, ButtonModule, FormlyModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent<T> {
  fields = input<FormlyFieldConfig[]>([]);
  form = input<FormGroup>({} as FormGroup);
  model = input<T>({} as T);
  options = input<FormlyFormOptions>({});
  buttonLabel = input<string>('');
  cancelButtonClass = input<string>('');
  cancelButtonLabel = input('Cancel');
  submitButtonClass = input<string>('');
  resetButtonClass = input<string>('');
  submitBtnLoading = input(false);
  showFormActions = input(true);
  showSubmitButton = input(true);
  showResetButton = input(false);
  showCancelButton = input(false);
  withFormPadding = input(false);
  footerFormClass = input('');
  detailsDialog = input<any[]>([] as any[]);
  // @Output() onCancel = new EventEmitter();

  onSubmit = output<T>();
}
