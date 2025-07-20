import { ComponentType } from '@angular/cdk/portal';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
  BaseIndexComponent,
  LangService,
  TableWrapperComponent,
} from '@shared';
import { BlogCuComponent } from './blog-cu.component';
import { Blog } from './services/service-types';

@Component({
  selector: 'app-index-blogs',
  templateUrl:
    '/src/app/shared/components/basic-crud/base-index.component.html',
  standalone: true,
  imports: [AsyncPipe, TableWrapperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndexBlogsComponent extends BaseIndexComponent<
  Blog,
  ComponentType<BlogCuComponent>
> {
  currentLang = inject(LangService).currentLanguage;

  ngOnInit() {
    this.dialogComponent = BlogCuComponent;
    this.dialogConfig = { ...this.dialogConfig, width: '1100px' };

    this.indexMeta = {
      ...this.indexMeta,
      endpoints: { index: 'blogs/blog', delete: 'blogs/blog/delete' },
      indexTitle: this.#translate(_('Blogs')),
      indexIcon: 'fa-solid fa-newspaper',
      createBtnLabel: this.#translate(_('Create Blog')),
      indexTableKey: 'BLOGS_KEY',
      columns: [
        {
          name: 'id',
          title: this.#translate(_('#ID')),
          searchable: false,
          orderable: false,
        },
        {
          name: 'order',
          title: this.#translate(_('order')),
          searchable: false,
          orderable: false,
        },
        {
          name: `title_${this.currentLang()}`,
          title: this.#translate(_('title')),
          searchable: true,
          orderable: false,
        },
        {
          name: 'slug',
          title: this.#translate(_('slug')),
          searchable: true,
          orderable: false,
          trans: true,
        },
        {
          name: 'created_at',
          title: this.#translate(_('created at')),
          searchable: false,
          transform: { type: 'date', filter: 'MMM d, y' },
          orderable: false,
        },
      ],
    };
  }

  #translate(text: string) {
    return this.translate.instant(text);
  }
}
