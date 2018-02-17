import { Component, Input, DoCheck, IterableDiffers, IterableDiffer  } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';

import { SolveService } from '../../core/solve.service';
import { Solve } from '../../models/solve.model';

@Component({
  selector: 'app-averages',
  templateUrl: './averages.component.html',
  styleUrls: ['./averages.component.scss']
})
export class AveragesComponent implements DoCheck {
  @Input() solves: Solve[];

  displayedColumns = ['type', 'current', 'best'];
  averages: { current: Average, best: Average }[] = [];
  tableDataSource: BehaviorSubject<any[]> = new BehaviorSubject(this.averages);

  solvesDiffer: IterableDiffer<Solve>;

  averageTemplates: Average[] = [
    { type: 'Single', name: 'Single', solvesCount: 1, trimmedCount: 0, time: Infinity, solves: [] },
    { type: 'Mo3', name: 'Mean of 3', solvesCount: 3, trimmedCount: 0, time: Infinity, solves: [] },
    { type: 'Ao5', name: 'Average of 5', solvesCount: 5, trimmedCount: 1, time: Infinity, solves: [] },
    { type: 'Ao12', name: 'Average of 12', solvesCount: 12, trimmedCount: 1, time: Infinity, solves: [] },
    { type: 'Ao50', name: 'Average of 50', solvesCount: 50, trimmedCount: 3, time: Infinity, solves: [] },
    { type: 'Ao100', name: 'Average of 100', solvesCount: 100, trimmedCount: 5, time: Infinity, solves: [] }
  ];

  constructor(private differs: IterableDiffers, private solveService: SolveService) {
    this.solvesDiffer = differs.find([]).create(null);
  }

  ngDoCheck() {
    const solveChanges = this.solvesDiffer.diff(this.solves);
    if (solveChanges) {
      solveChanges.forEachAddedItem(({ currentIndex }) => {
        const solves = this.solves.slice(0, currentIndex + 1);
        _.each(_.filter(this.averageTemplates, { solvesCount: solves.length }), averageTemplate => {
          this.averages.push({ current: averageTemplate, best: averageTemplate });
        });
        this.updateAverages(solves);
      });
    }
    this.tableDataSource.next(this.averages);
  }

  updateAverages(solves: Solve[]): void {
    this.averages.forEach(average => {
      const currentAverage = average.current;
      currentAverage.solves = _.takeRight(solves, currentAverage.solvesCount);
      currentAverage.time = this.solveService.calculateAverage(currentAverage.solves, currentAverage.trimmedCount);
      average.best = _.minBy([_.cloneDeep(currentAverage), average.best], 'time');
    });
  }

  showAverage(average: Average): void {
    console.log(average);
  }
}

interface Average {
  type: string,
  name: string,
  solvesCount: number,
  trimmedCount: number,
  time: number,
  solves: Solve[]
}
