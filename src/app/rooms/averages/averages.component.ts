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
  averages: { type: string, solvesCount: number, trimmedCount: number, current: number, best: number }[] = [];
  tableDataSource: BehaviorSubject<any[]> = new BehaviorSubject(this.averages);

  solvesDiffer: IterableDiffer<Solve>;

  averageDefinitions = [
    { type: 'Single', solvesCount: 1, trimmedCount: 0, current: null, best: Infinity },
    { type: 'Mo3', solvesCount: 3, trimmedCount: 0, current: null, best: Infinity },
    { type: 'Ao5', solvesCount: 5, trimmedCount: 1, current: null, best: Infinity },
    { type: 'Ao12', solvesCount: 12, trimmedCount: 1, current: null, best: Infinity },
    { type: 'Ao50', solvesCount: 50, trimmedCount: 3, current: null, best: Infinity },
    { type: 'Ao100', solvesCount: 100, trimmedCount: 5, current: null, best: Infinity },
  ];

  constructor(private differs: IterableDiffers, private solveService: SolveService) {
    this.solvesDiffer = differs.find([]).create(null);
  }

  ngDoCheck() {
    const solveChanges = this.solvesDiffer.diff(this.solves);
    if (solveChanges) {
      solveChanges.forEachAddedItem(({ currentIndex }) => {
        const solves = this.solves.slice(0, currentIndex + 1);
        this.averages.push(..._.filter(this.averageDefinitions, { solvesCount: solves.length }));
        this.updateAverages(solves);
      });
    }
    this.tableDataSource.next(this.averages);
  }

  updateAverages(solves: Solve[]): void {
    this.averages.forEach(average => {
      const averageSolves = _.takeRight(solves, average.solvesCount);
      average.current = this.solveService.calculateAverage(averageSolves, average.trimmedCount);
      average.best = _.min([average.current, average.best]);
    });
  }
}
