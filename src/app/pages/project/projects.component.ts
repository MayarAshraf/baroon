import { ComponentType } from '@angular/cdk/portal';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateModule } from '@ngx-translate/core';
import { UnitTypesDialogComponent } from '@pages/unit-types/unit-types-dialog.component';
import {
  BaseIndexComponent,
  LangService,
  TableWrapperComponent,
} from '@shared';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ProjectDialogComponent } from './project-dialog.component';
import { Project } from './services/service-type';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    AsyncPipe,
    TableWrapperComponent,
    ButtonModule,
    RouterLink,
    TooltipModule,
    TranslateModule,
  ],
  templateUrl: './project.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProjectsComponent extends BaseIndexComponent<
  Project,
  ComponentType<ProjectDialogComponent>
> {
  currentLang = inject(LangService).currentLanguage;

  ngOnInit() {
    this.dialogConfig = { ...this.dialogConfig, width: '1200px' };
    this.dialogComponent = ProjectDialogComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: 'inventory/projects',
        delete: 'inventory/projects/delete',
      },
      indexTitle: this.#translate(_('projects')),
      indexIcon: 'fas fa-city',
      createBtnLabel: this.#translate(_('Create Project')),
      indexTableKey: 'PROJECTS_KEY',
      columns: [
        {
          title: this.#translate(_('title')),
          name: `title_${this.currentLang()}`,
          searchable: true,
          orderable: false,
        },
        {
          title: this.#translate(_('project_number')),
          name: `project_number`,
          searchable: true,
          orderable: false,
        },
        {
          title: this.#translate(_('created at')),
          name: 'created_at',
          searchable: false,
          orderable: false,
          transform: { type: 'date', filter: 'MMM d, y' },
        },
      ],
    };
  }

  #translate(text: string) {
    return this.translate.instant(text);
    
  }

  openDialogUnitType(project: Project) {
    this.dialogService.open(UnitTypesDialogComponent, {
      ...this.dialogConfig,
      data: {
        project_id: project.id,
        purposes: project.purposes,
        method: 'create',
      },
    });
  }
}
