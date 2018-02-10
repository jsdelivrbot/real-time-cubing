import { Pipe, PipeTransform } from '@angular/core';

import { Solve, Penalty } from '../../models/solve.model';

@Pipe({
  name: 'solve'
})
export class SolvePipe implements PipeTransform {
  transform(solve: Solve): string {
    if (!solve) {
      return '';
    }
    switch (solve.penalty) {
      case Penalty.None:
        return `${solve.time}`;
      case Penalty.PlusTwo:
        return `${solve.time + 2}+`;
      case Penalty.DNF:
        return 'DNF';
      default:
        throw new Error(`Unrecognized Penalty: ${solve.penalty}.`);
    };
  }
}
