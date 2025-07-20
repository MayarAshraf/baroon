import { inject, Injectable } from '@angular/core';
import { ApiService } from '@shared';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationsBreadCrumbService {
  #api = inject(ApiService);

  getLabelBreadCrumb(id: number) {
    return this.#api
      .request('get', `locations/location/${id}`)
      .pipe(map(({ data }) => data));
  }
}
