import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class RolesVisibilityDirective<T> {
  #viewContainer = inject(ViewContainerRef);
  #templateRef = inject(TemplateRef<T>);

  @Input() set appHasRole(hasPermission: boolean) {
    if (hasPermission) {
      this.#viewContainer.createEmbeddedView(this.#templateRef);
    } else {
      this.#viewContainer.clear();
    };
  };
}
