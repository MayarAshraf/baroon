import { Injectable, inject } from '@angular/core';
import { CachedListService } from '@shared';

export interface DashboardItem {
  title: string;
  value: any;
  icon: string;
  url_slug: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  #cachedList = inject(CachedListService);

  getDashboardData$ = this.#cachedList.getListData(
    'dashboard/dashboard',
    'GET'
  );
}
