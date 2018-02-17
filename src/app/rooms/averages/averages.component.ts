import { Component, Input, DoCheck, IterableDiffers, IterableDiffer, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';
import * as clipboard from 'clipboard-polyfill';

import { SolveService } from '../../core/solve.service';
import { Solve } from '../../models/solve.model';
import { TimePipe } from '../../shared/time/time.pipe';
import { SolvePipe } from '../../shared/solve/solve.pipe';

interface Average {
  type: string,
  name: string,
  solvesCount: number,
  trimmedCount: number,
  time: number,
  solves: Solve[]
}

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

  constructor(private differs: IterableDiffers, private solveService: SolveService, private dialog: MatDialog) {
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
    this.dialog.open(AverageDialogComponent, {
      data: { average }
    });
  }
}

@Component({
  selector: 'app-average-dialog',
  templateUrl: 'average-dialog.component.html',
})
export class AverageDialogComponent {
  average: Average;
  text: string;
  trimmedSolves: Solve[];

  constructor(
    private timePipe: TimePipe,
    private solvePipe: SolvePipe,
    private solveService: SolveService,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.average = data.average;

    const sortedSolves = _.sortBy(this.average.solves, (solve: Solve) => solveService.timeWithPenalty(solve));
    this.trimmedSolves = _.concat(
      _.take(sortedSolves, this.average.trimmedCount),
      _.takeRight(sortedSolves, this.average.trimmedCount)
    );

    this.text = `${this.average.name}: ${timePipe.transform(this.average.time)}\n\n`
    this.text += this.average.solves
      .map((solve: Solve, index: number) => `${index + 1}. ${this.formatSolve(solve)} ${solve.scramble}`)
      .join('\n');
  }

  formatSolve(solve: Solve): string {
    const formatted = this.solvePipe.transform(solve);
    return this.trimmedSolves.includes(solve) ? `(${formatted})` : formatted;
  }

  copyToClipboard(): void {
    (clipboard as any).writeText(this.text);
  }
}
