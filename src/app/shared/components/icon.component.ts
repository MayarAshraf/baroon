import { ChangeDetectionStrategy, Component, ElementRef, Input, SimpleChanges, inject, numberAttribute, signal } from '@angular/core';
import { loadIcon } from 'iconify-icon';
import { SafeContentPipe } from "../pipes/safe-content.pipe";
import { input } from "@angular/core";

@Component({
  selector: 'icon',
  template: `
    @if (loaded()) {
      <svg [attr.viewBox]="viewBox" [innerHTML]="path | safeContent:'html'"></svg>
    } @else {
      <div class="placeholder"></div>
    }
  `,
  standalone: true,
  exportAs: 'icon',
  host: { 'class': 'icon', '[class.is-loaded]': 'loaded' },
  styles: [`
    :host {
      --icon-size: 24px;
      --icon-svg-size: 24px;
      --icon-placeholder-bg: #ccc;
      min-width: var(--icon-size);
      min-height: var(--icon-size);
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
    }

    :host svg {
      width: var(--icon-svg-size);
      height: var(--icon-svg-size);
      flex: none;
    }

    :host .placeholder {
      width: 100%;
      height: 100%;
      flex: none;
      border-radius: 50%;
      background: var(--icon-placeholder-bg);
    }
  `],
  imports: [SafeContentPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  #elementRef = inject(ElementRef);

  name = input<string>('');

  @Input({ transform: numberAttribute }) set size(size: number) {
    this.#elementRef.nativeElement.style.setProperty('--icon-svg-size', size + 'px');
  };

  path = '';
  loaded = signal(false);

  #viewBoxWidth = 0;
  #viewBoxHeight = 0;

  get viewBox() {
    return `0 0 ${this.#viewBoxWidth} ${this.#viewBoxHeight}`
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['name'] && changes['name'].currentValue !== changes['name'].previousValue) {
      this.#loadIcon();
    }
  };

  #loadIcon() {
    this.loaded.set(false);
    loadIcon(this.name())
      .then(data => {
        this.path = data.body;
        this.#viewBoxWidth = data.width;
        this.#viewBoxHeight = data.height;
        this.loaded.set(true);
      })
      ;
  }
}
