import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmService } from '../services';

@Component({
  selector: 'app-confirm',
  template: `
    <!-- p-confirmPopup instance declared once in app.component.html -->
    <button
      pButton
      pRipple
      type="button"
      (click)="confirm()"
      [class]="buttonClass()"
      [disabled]="disabled()"
      [pTooltip]="tooltip()"
      [tooltipPosition]="tooltipPosition() || 'top'"
      [icon]="icon()"
      [label]="label()"
    ></button>
  `,
  standalone: true,
  imports: [ButtonModule, TooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmButtonComponent {
  #confirmService = inject(ConfirmService);

  icon = input<string>('');
  label = input<string>('');
  buttonClass = input<string>();
  tooltip = input<string>('');
  tooltipPosition = input<string>();
  disabled = input<boolean>();
  @Output() acceptAction = new EventEmitter();

  confirm() {
    this.#confirmService.confirmDelete({
      acceptCallback: () => this.acceptAction.emit(),
    });
  }
}
