import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConnectedOverlayScrollHandler } from 'primeng/dom';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { input } from "@angular/core";

@Component({
  selector: 'app-dropdown-menu',

      template: `
    @if (item().routerLink) {
      <a pButton [routerLink]="item().routerLink"
          routerLinkActive="active-link"
          [routerLinkActiveOptions]="{exact: true}"
          [pTooltip]="item().tooltip ?? ''"
          tooltipPosition="bottom"
          [icon]="item().icon ?? ''"
          [label]="withLabel() ? item().label || '' : ''"
          [class]="'button p-2'+' '+styleClass()"
          [ngClass]="{'w-2rem h-2rem': !withLabel()}"></a>
    } @else {
      <button pButton (click)="op.toggle($event)"
          [pTooltip]="item().tooltip ?? ''"
          tooltipPosition="bottom"
          [label]="withLabel() ? item().label || '' : ''"
          [icon]="item().icon ?? ''"
          [class]="'button p-2'+' '+styleClass()"
          [ngClass]="{'w-2rem h-2rem': !withLabel()}"></button>

      <p-overlayPanel #op [dismissable]="dismissablePanel()"
        [styleClass]="'border-primary border-bottom-3 border-solid' + ' ' + overlayStyleClass()">
        <ng-content></ng-content>
      </p-overlayPanel>
    }

  `,
  styles: [`
    .button {
      overflow: visible;
      transition: none;

      &:hover,
      &.active-link {
          background-color: var(--highlight-text-color);
          border-color: var(--highlight-text-color);
        }
    }
  `],
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, ButtonModule, OverlayPanelModule, TooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownMenuComponent {
  item = input<MenuItem>({} as MenuItem);
  withLabel = input(false);
  styleClass = input<string>('');
  overlayStyleClass = input<string>('');
  dismissablePanel = input(true);

  @ViewChild('op') overlayPanel!: OverlayPanel;

  hidePanel() {
    this.overlayPanel.hide();
  };

  // Keep overlay panel open on page scroll
  // https://github.com/primefaces/primeng/issues/11470
  ngAfterViewInit(): void {
    if (!this.overlayPanel) return;
    this.overlayPanel.bindScrollListener = () => {
      if (!this.overlayPanel.scrollHandler) {
        this.overlayPanel.scrollHandler = new ConnectedOverlayScrollHandler(this.overlayPanel.target, () => {
          this.overlayPanel.align();
        });
      }
      this.overlayPanel.scrollHandler.bindScrollListener();
    };
  }
}
