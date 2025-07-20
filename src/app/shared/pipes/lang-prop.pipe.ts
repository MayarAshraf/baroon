import { inject, Pipe, PipeTransform } from '@angular/core';
import { LangService } from '@shared';

@Pipe({
  name: 'langProp',
  standalone: true,
})
export class LangPropPipe implements PipeTransform {
  currentLang = inject(LangService).currentLanguage;

  transform(value: any, propAr: string, propEn: string) {
    return this.currentLang() === 'ar' ? value[propAr] : value[propEn];
  }
}
