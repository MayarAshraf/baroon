import { NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbService, LangService } from '../services';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [TitleCasePipe, TranslateModule, RouterLink, NgTemplateOutlet],
  template: `
    @if (breadcrumbs().length) {
    <nav aria-label="breadcrumb">
      <ol class="list-none p-0 mt-0 flex flex-wrap">
        @for (breadcrumb of breadcrumbs(); let last = $last; track $index) {
        <li class="text-xs font-semibold">
          @if (!last) {
          <a [routerLink]="breadcrumb.url" class="text-blue">
            <ng-container
              *ngTemplateOutlet="
                breadcrumbItem;
                context: { $implicit: breadcrumb }
              "
            ></ng-container>
          </a>
          <span class="flex-shrink-0 mx-2 text-primary">
             @if (currentLang() === 'en') {
            <i class="fas fa-chevron-right"></i>
            }
            @if (currentLang() === 'ar') {
            <i class="fas fa-chevron-left"></i>
            }
          </span>
          } @else {
          <span class="text-500 font-bold">
            <ng-container
              *ngTemplateOutlet="
                breadcrumbItem;
                context: { $implicit: breadcrumb }
              "
            ></ng-container>
          </span>
          }
        </li>
        }
      </ol>
      <ng-template #breadcrumbItem let-breadcrumb>
        @if (breadcrumb.icon) {
        <i [class]="breadcrumb.icon + ' text-xs'"></i>
        }
        {{ breadcrumb.label | titlecase | translate }}
      </ng-template>
    </nav>
    }
  `,
})
export class BreadcrumbComponent {
  breadcrumbs = inject(BreadcrumbService).breadcrumbs;
  currentLang = inject(LangService).currentLanguage;
}
