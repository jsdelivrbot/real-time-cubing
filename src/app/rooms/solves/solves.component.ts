import { Component, Input, DoCheck, IterableDiffers, IterableDiffer } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';

import { SolveService } from '../../core/solve.service';
import { Solve } from '../../models/solve.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-solves',
  templateUrl: './solves.component.html',
  styleUrls: ['./solves.component.scss']
})
export class SolvesComponent implements DoCheck {
  @Input() solves: Solve[];
  @Input() users: User[];

  averagesByUser: { [userId: string]: { ao5: number, ao12: number } } = {};
  tableData: any[] = [];
  tableDataSource: BehaviorSubject<any[]> = new BehaviorSubject(this.tableData);
  displayedColumns: any[] = ['solveNumber'];

  solvesDiffer: IterableDiffer<Solve>;
  usersDiffer: IterableDiffer<User>;

  constructor(private differs: IterableDiffers, private solveService: SolveService) {
    this.solvesDiffer = differs.find([]).create(null);
    this.usersDiffer = differs.find([]).create(null);
  }

  ngDoCheck() {
    const userChanges = this.usersDiffer.diff(this.users);
    if (userChanges) {
      userChanges.forEachAddedItem(({ item: user }) => this.displayedColumns.push(user._id));
      userChanges.forEachRemovedItem(({ item: user }) => _.pull(this.displayedColumns, user._id));
    }
    const solveChanges = this.solvesDiffer.diff(this.solves);
    if (solveChanges) {
      solveChanges.forEachAddedItem(({ item: solve }) => {
        const row = this.tableData[solve.index] = this.tableData[solve.index] || { bestTime: Infinity };
        row[solve.userId] = solve;
        row.bestTime = _.min([row.bestTime, this.solveService.timeWithPenalty(solve)]);
      });
      this.tableDataSource.next(this.tableData);
      this.averagesByUser = this.calculateAveragesByUser();
      /* Scroll to the most recent time. */
      const table = document.getElementsByClassName('mat-table')[0];
      table.scrollTop = table.scrollHeight;
    }
  }

  calculateAveragesByUser() {
    return _.mapValues(_.groupBy(this.solves, 'userId'), (solves, userId) => ({
      ao5: solves.length >= 5 ? this.solveService.calculateAverage(_.takeRight(solves, 5), 1) : null,
      ao12: solves.length >= 12 ? this.solveService.calculateAverage(_.takeRight(solves, 12), 1) : null
    }));
  }


  isBest(solve: Solve, bestTime: number): boolean {
    return this.solveService.timeWithPenalty(solve) === bestTime;
  }
}
