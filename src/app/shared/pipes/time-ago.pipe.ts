import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Pipe({ name: 'timeAgo', standalone: true })

export class TimeAgoPipe implements PipeTransform {
  transform(date: number | Date): string {
    if (!date) return '';
    return formatDistanceToNow(date) + ' ago';
  }
}

/*
<p>{{ someDate | timeAgo }}</p> // Example: "3 hours ago" or "yesterday"
*/