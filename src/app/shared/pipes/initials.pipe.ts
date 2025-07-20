import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'initials', standalone: true })

export class InitialsPipe implements PipeTransform {
  transform(fullName: string): string {
    if (!fullName) return '';
    const nameParts = fullName.split(' ');
    return nameParts
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }
}

/*
<p>{{ 'John Doe' | initials }}</p> // Output: "JD"
initials means ==> "الأحرف الأولى"
*/