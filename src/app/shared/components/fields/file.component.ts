import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'formly-field-file',
  template: `
    <div class="p-field">
      @if (props.fileLabel) {
        <label [ngClass]="props.labelClass">
          {{ props.fileLabel | translate }}
          @if (props.required && props.hideRequiredMarker !== true) {
            <span class="text-red-500">*</span>
          }
        </label>
        @if (props.description) {
          <p class="my-1 font-bold capitalize font-medium text-xs">
            {{ props.description | translate }}
          </p>
        }
      }

      <p-fileUpload
        #fileUploader
        [styleClass]="props.styleClass"
        [mode]="props.mode ?? 'advanced'"
        (onSelect)="
          props.onSelect ? props.onSelect($event, field) : updateControlValue()
        "
        [multiple]="props.multiple ?? false"
        [disabled]="props.disabled ?? false"
        [accept]="props.accept ?? '.jpeg,.jpg,.png'"
        [maxFileSize]="props.maxFileSize ?? 10485760"
        [fileLimit]="props.fileLimit"
        [chooseLabel]="props.chooseLabel ?? 'Choose' | translate"
        chooseStyleClass="main-cta border-round border-none shadow-none"
        uploadStyleClass="main-cta border-round border-none shadow-none"
        cancelStyleClass="main-cta border-round border-none shadow-none"
        removeStyleClass="main-cta border-round border-none shadow-none w-2rem h-2rem"
        [chooseIcon]="props.chooseIcon ?? 'pi pi-image'"
        [showUploadButton]="false"
        [showCancelButton]="false"
      >
        <ng-template pTemplate="content" let-files>
          @if (files?.length > 0) {
            <div class="flex gap-3 flex-wrap">
              @for (file of files; track $index; let i = $index) {
                <div class="relative w-7rem h-7rem p-1 border-2 border-200">
                  @if (props.multiple) {
                    <button
                      pButton
                      class="p-button-rounded p-button-outlined p-button-plain bg-white hover:bg-gray-50 w-1.5rem h-1.5rem absolute p-0"
                      type="button"
                      style="top: -.57rem; right: -.57rem;"
                      icon="pi pi-times text-xs"
                      (click)="
                        fileUploader.remove($event, i); updateControlValue()
                      "
                    ></button>
                  }
                  <img [src]="file.objectURL" class="w-full h-full img-cover" />
                </div>
              }
            </div>
          }
        </ng-template>

        <ng-template pTemplate="file"></ng-template>

        <ng-template pTemplate="empty">
          <div
            class="flex align-items-center justify-content-center flex-column"
          >
            <i class="pi pi-cloud-upload text-2xl"></i>
            <p class="mt-3 mb-0">
              {{ 'Drag and drop files to here to upload' | translate }}
            </p>
          </div>
        </ng-template>
      </p-fileUpload>

      @if (showError && formControl.errors) {
        <small class="p-error" role="alert">
          <formly-validation-message
            [field]="field"
          ></formly-validation-message>
        </small>
      }
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NgTemplateOutlet,
    FormlyModule,
    ButtonModule,
    TranslateModule,
    FileUploadModule,
  ],
})
export class FileFieldComponent extends FieldType<FieldTypeConfig> {
  fileUploader = viewChild.required<FileUpload>('fileUploader');

  ngOnInit() {
    const controlValue = this.formControl.value;

    if (!this.props.multiple && this.formControl.value) {
      this.formControl.setValue(null);
    }

    if (controlValue) {
      const value = this.props.multiple ? controlValue : [controlValue];
      const files = value.map((url: string) => ({ objectURL: url }));
      this.fileUploader().files.push(...files);
    }
  }

  updateControlValue() {
    const files: (File | { objectURL: string })[] = this.fileUploader().files;
    const formValue = files.map((file) =>
      file instanceof File ? file : file.objectURL,
    );
    this.formControl.setValue(this.props.multiple ? formValue : formValue[0]);
  }
}
