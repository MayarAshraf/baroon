import { inject, Injectable } from '@angular/core';
import { CachedListService } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class LookupsService {
  #cacheList = inject(CachedListService);

  getLookupsList(slug: string) {
    return this.#cacheList.getListData(`lookups/by_parent_slug/${slug}`, 'GET');
  }
}
