import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'formly-field-tabs',
  standalone: true,
  imports: [FormlyModule, ReactiveFormsModule, TranslateModule, TabViewModule],
  template: `
    <p-tabView>
      @for (tab of field.fieldGroup; track $index) {
        <p-tabPanel [header]="tab.props?.label || '' | translate">
          <formly-field [field]="tab"></formly-field>
        </p-tabPanel>
      }
    </p-tabView>
  `,
  styles: `
    :host ::ng-deep .p-tabview {
      .p-tabview-panels {
        padding-inline: 0;
        padding-bottom: 0;
      }

      .p-tabview-nav {
        display: flex;
        gap: 1.2rem;
        border-bottom: 0;

        li .p-tabview-nav-link {
          padding-top: 0;
          padding-inline: 0;
          margin-bottom: 0;
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsFormComponent extends FieldType { }