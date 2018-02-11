import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  transform(time: number): string {
    const date = new Date(null);
    date.setMilliseconds(Math.floor(time * 1000));
    return date.toISOString().substr(11, 11).replace(/^[0:]*(?!\.)/g, '');
  }
}
