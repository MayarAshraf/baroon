import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Pipe({ name: 'relativeTime', standalone: true })

export class RelativeTimePipe implements PipeTransform {
  transform(date: number | Date): string {
    if (!date) return '';
    return formatDistanceToNow(date, { addSuffix: true });
  }
}

/*
{{ someDate | relativeTime }} // Example: "just now," "a few minutes ago," "yesterday," etc.
*/