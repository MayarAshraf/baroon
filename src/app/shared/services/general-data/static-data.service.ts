import { Injectable, inject } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class StaticDataService {
  #translate = inject(TranslateService);

  public languages = [
    {
      value: 'en',
      label: this.#translate.instant(_('English')),
      image: 'assets/media/languages/en.png',
    },
    {
      value: 'ar',
      label: this.#translate.instant(_('Arabic')),
      image: 'assets/media/languages/ar.png',
    },
  ];

  public typesSetting = [
    { value: 'icon', label: this.#translate.instant(_('icon')) },
    { value: 'image', label: this.#translate.instant(_('image')) },
    { value: 'title', label: this.#translate.instant(_('title')) },
    { value: 'description', label: this.#translate.instant(_('description')) },
  ];

  public typeCareer = [
    { value: 'Part Time', label: this.#translate.instant(_('part time')) },
    { value: 'Full Time', label: this.#translate.instant(_('full time')) },
  ];
}
