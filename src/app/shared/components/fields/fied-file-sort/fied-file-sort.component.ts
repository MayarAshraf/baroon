import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import {
  FileRemoveEvent,
  FileSelectEvent,
  FileUploadModule,
} from 'primeng/fileupload';
import { OrderListModule } from 'primeng/orderlist';

@Component({
  selector: 'app-fied-file-sort',
  standalone: true,
  imports: [
    FormlyModule,
    TranslateModule,
    ButtonModule,
    OrderListModule,
    FileUploadModule,
    ReactiveFormsModule,
  ],
  templateUrl: './fied-file-sort.component.html',
  styleUrl: './fied-file-sort.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiedFileSortComponent extends FieldType<FieldTypeConfig> {
  previewUrls = signal<string[]>([]);

  onSelect(event: FileSelectEvent) {
    if (event.currentFiles && event.currentFiles.length > 0) {
      const file = event.currentFiles;
      this.formControl?.setValue(file);
    }
  }

  onRemove(event: FileRemoveEvent) {
    this.formControl?.setValue(null);
  }

  ngOnInit() {
    if (!this.formControl?.value) return;
    this.previewUrls.set(this.formControl?.value);
    const files = this.formControl?.value.filter(
      (file: any) => typeof this.formControl?.value !== 'string'
    );
    this.formControl?.setValue(!files.length ? null : files);
  }
}
