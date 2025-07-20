import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-title',
  standalone: true,
  template: `
    @if(typeHeader === 'h1'){
      <h1 [class]="titleClass + ' ' +'font-bold text-4xl mb-2'"> {{title}}</h1>
    }

    @if(typeHeader === 'h2'){
      <h2 [class]="titleClass + ' ' +'font-semibold text-3xl mb-2'"> {{title}}</h2>
    }

    @if(typeHeader === 'h3'){
      <h3 [class]="titleClass + ' ' +'text-base mb-2 text-900'"> {{title}}</h3>
    }

    <p [class]="descriptionClass">
      <ng-content></ng-content>
    </p>
  `,
  imports: [],
  styles: [`
    p:empty{
      display : none
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionTitleComponent {
  @Input() title !: string;
  @Input() titleClass = '';
  @Input() descriptionClass = 'text-400';
  @Input() typeHeader: 'h1' | 'h2' | 'h3' = 'h1';
}
