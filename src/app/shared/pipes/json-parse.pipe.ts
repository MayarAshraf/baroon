import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'jsonParse', standalone: true })
export class JsonParsePipe implements PipeTransform {
  transform(value: string , local : string) {
    if (!value) return [];
    return JSON.parse(value)[local];
  }
}
