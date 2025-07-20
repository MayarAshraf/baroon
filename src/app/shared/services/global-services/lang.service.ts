import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '@shared';
import { PrimeNGConfig } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class LangService {
  #document = inject(DOCUMENT);
  #primengConfig = inject(PrimeNGConfig);
  #translate = inject(TranslateService);
  #storage = inject(StorageService);
  #destroyRef = inject(DestroyRef);

  #LANG_KEY = 'LANGUAGE_APP';
  currentLanguage = signal<string>(this.#storage.getLocalData(this.#LANG_KEY));

  switchLanguage(lang: string) {
    this.#translate.use(lang);
    this.#storage.storeLocalData(this.#LANG_KEY, lang);
    this.currentLanguage.set(lang);
    this.changeHtmlAttributes(lang);
    this.translatePrimeNg();
  }

  changeHtmlAttributes(lang: string) {
    const htmlTag = this.#document.getElementsByTagName(
      'html'
    )[0] as HTMLHtmlElement;
    htmlTag.lang = lang;
    htmlTag.dir = lang === 'en' ? 'ltr' : 'rtl';
  }

  translatePrimeNg() {
    this.#translate
      .get('primeng')
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => this.#primengConfig.setTranslation(res));
  }
}
