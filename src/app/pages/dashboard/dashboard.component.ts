import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { BlogCuComponent } from '@pages/blogs/blog-cu.component';
import { ProjectDialogComponent } from '@pages/project/project-dialog.component';
import { Project } from '@pages/project/services/service-type';
import { LangPropPipe, LangService, RangePipe } from '@shared';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SkeletonModule } from 'primeng/skeleton';
import { tap } from 'rxjs';
import { CardContentComponent } from './card-content/card-content.component';
import {
  DashboardItem,
  DashboardService,
} from './card-content/service/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardContentComponent,
    SkeletonModule,
    LangPropPipe,
    ButtonModule,
    TranslateModule,
    RangePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class dashboardComponent {
  #dashboardService = inject(DashboardService);
  #dialogService = inject(DialogService);
  #currentLang = inject(LangService).currentLanguage;

  statistics = signal<DashboardItem[]>([]);
  blogs = signal<DashboardItem | null>(null);
  projects = signal<DashboardItem | null>(null);
  applicants = signal<DashboardItem | null>(null);
  events = signal<DashboardItem | null>(null);

  protected dialogConfig: DynamicDialogConfig<Project> = {
    showHeader: false,
    width: '800px',
    height: '100%',
    modal: true,
    focusOnShow: true,
    styleClass: 'm-0 max-h-full transform-none',
    position: this.#currentLang() === 'en' ? 'right' : 'left',
    rtl: this.#currentLang() !== 'en',
    closable: true,
    closeOnEscape: true,
    dismissableMask: false,
  };

  dashboardData$ = this.#dashboardService.getDashboardData$.pipe(
    tap((data) => {
      this.statistics.set(
        data.filter(
          (item: any) =>
            item.url_slug !== 'applicant' &&
            item.url_slug !== 'latest-blogs' &&
            item.url_slug !== 'latest-projects' &&
            item.url_slug !== 'event',
        ),
      );
      this.blogs.set(
        data.find((item: any) => item.url_slug === 'latest-blogs'),
      );
      this.projects.set(
        data.find((item: any) => item.url_slug === 'latest-projects'),
      );
      this.applicants.set(
        data.find((item: any) => item.url_slug === 'applicant'),
      );
      this.events.set(data.find((item: any) => item.url_slug === 'event'));
    }),
  );

  dashboardData = toSignal(this.dashboardData$, { initialValue: null });

  createProject() {
    this.#dialogService.open(ProjectDialogComponent, {
      ...this.dialogConfig,
      width: '1200px',
    });
  }

  createBlog() {
    this.#dialogService.open(BlogCuComponent, {
      ...this.dialogConfig,
      width: '1480px',
    });
  }
}
