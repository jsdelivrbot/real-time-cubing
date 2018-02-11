import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { Solve, Penalty } from '../models/solve.model';

@Injectable()
export class SolveService {
  calculateAverage(solves: Solve[], trimmedCount: number): number {
    return _(solves)
      .map(solve => this.timeWithPenalty(solve))
      .sortBy()
      .drop(trimmedCount)
      .dropRight(trimmedCount)
      .mean();
  }

  timeWithPenalty(solve: Solve): number {
    switch (solve.penalty) {
      case Penalty.None:    return solve.time;
      case Penalty.PlusTwo: return solve.time + 2;
      case Penalty.DNF:     return Infinity;
    }
  }
}
