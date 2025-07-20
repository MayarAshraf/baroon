import { Injectable } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { distinctUntilChanged, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SlugInputService {
  getSlugField(): FormlyFieldConfig {
    return {
      key: 'slug',
      type: 'floated-input-field',
      props: {
        required: true,
        label: _('slug'),
        // disabled:
        //   this.#authService.userRole() != 'users-roles-technical-support',
      },
      hooks: {
        onInit: (field: FormlyFieldConfig) => {
          return field.formControl?.valueChanges.pipe(
            distinctUntilChanged(),
            tap((val) => {
              let transformedValue = val.toLowerCase().replace(/\s+/g, '-');
              field.formControl?.setValue(transformedValue);
            })
          );
        },
      },
    };
  }
}
