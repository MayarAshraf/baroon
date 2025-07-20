import { ComponentType } from '@angular/cdk/portal';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
  AuthService,
  BaseIndexComponent,
  LangService,
  TableWrapperComponent,
} from '@shared';
import { ImageModule } from 'primeng/image';
import { GeneralSettingCuComponent } from './general-settings-dialog.component';
import { GeneralSetting } from './services/service-type';

@Component({
  selector: 'app-index-general-settings',
  standalone: true,
  imports: [AsyncPipe, TableWrapperComponent, NgTemplateOutlet, ImageModule],
  templateUrl:
    '/src/app/shared/components/basic-crud/base-index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexGeneralSettingsComponent extends BaseIndexComponent<
  GeneralSetting,
  ComponentType<GeneralSettingCuComponent>
  > {

  currentLang = inject(LangService).currentLanguage;

  ngOnInit() {
    this.roles.set({
      ...this.roles(),
      create: false,
      delete:false
    });
    this.dialogComponent = GeneralSettingCuComponent;
    this.indexMeta = {
      ...this.indexMeta,
      endpoints: {
        index: 'settings/general-settings',
        delete: 'settings/general-settings/delete',
      },
      indexTitle: this.#translate(_('General Setting')),
      indexIcon: 'pi pi-cog',
      createBtnLabel: this.#translate(_('Create Setting')),
      indexTableKey: 'CONTACT_DEATILS_KEY',
      columns: [
        {
          name: 'id',
          title: this.#translate(_('#ID')),
          searchable: false,
          orderable: false,
        },
        {
          name: 'slug',
          title: this.#translate(_('slug')),
          searchable: true,
          orderable: false,
        },
        {
          name: 'screen_shot',
          title: this.#translate(_('screen shot')),
          searchable: false,
          orderable: false,
          transform: { type: 'image', width: 300, height: 300 },
        },
      ],
    };
  }

  #translate(text: string) {
    return this.translate.instant(text);
  }
}
