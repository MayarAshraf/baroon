import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LangService } from '../services';

@Component({
  selector: 'app-lang-switcher',
  template: `
    @if(currentLang()) {
    <button
      pButton
      class="w-2.5rem h-2.5rem p-0 p-button-rounded p-button-text"
      [label]="currentLang() === 'en' ? 'EN' : 'AR'"
      (click)="switchLang()"
    ></button>
    }
  `,
  standalone: true,
  imports: [ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSwitcherComponent {
  #langService = inject(LangService);
  #location = inject(Location);

  currentLang = this.#langService.currentLanguage;
  RELOAD_DELAY = 1000;

  switchLang() {
    const newLang = this.currentLang() === 'en' ? 'ar' : 'en';
    this.#langService.switchLanguage(newLang);
    this.#location.go(this.#location.path());
    setTimeout(() => location.reload(), this.RELOAD_DELAY);
  }
}
