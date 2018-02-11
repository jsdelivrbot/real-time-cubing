import { Pipe, PipeTransform } from '@angular/core';

import { TimePipe } from '../time/time.pipe';
import { Solve, Penalty } from '../../models/solve.model';

@Pipe({
  name: 'solve'
})
export class SolvePipe implements PipeTransform {
  constructor(private timePipe: TimePipe) {}

  transform(solve: Solve): string {
    if (!solve) {
      return '';
    }
    switch (solve.penalty) {
      case Penalty.None:
        return this.timePipe.transform(solve.time);
      case Penalty.PlusTwo:
        return this.timePipe.transform(solve.time + 2) + '+';
      case Penalty.DNF:
        return 'DNF';
      default:
        throw new Error(`Unrecognized Penalty: ${solve.penalty}.`);
    };
  }
}
