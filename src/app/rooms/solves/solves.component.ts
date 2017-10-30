import { Component, Input, DoCheck, IterableDiffers } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';

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

  tableData: BehaviorSubject<any> = new BehaviorSubject({});
  tableDataSource = new TableDataSource(this.tableData);
  displayedColumns: any[];

  solvesDiffer: any;
  usersDiffer: any;

  constructor(private differs: IterableDiffers) {
    this.solvesDiffer = differs.find([]).create(null);
    this.usersDiffer = differs.find([]).create(null);
  }

  ngDoCheck() {
    if (this.solvesDiffer.diff(this.solves) || this.usersDiffer.diff(this.users)) {
      this.displayedColumns = ['solveNumber', ..._.map(this.users, '_id')];
      this.tableData.next(_.map(_.groupBy(this.solves, 'index'), (solves: Solve[], solveIndex: string) => {
        const row: any = {};
        row.solveNumber = _.toNumber(solveIndex) + 1;
        solves.forEach(solve => row[solve.userId] = solve);
        row.bestTime = _.min(_.map(solves, 'time'));
        return row;
      }));
      /* Scroll to the most recent time. */
      const table = document.getElementsByClassName('mat-table')[0];
      table.scrollTop = table.scrollHeight;
    }
  }
}

export class TableDataSource extends DataSource<any> {
  constructor(private data) {
    super();
  }

  connect(): Observable<any> {
    return this.data;
  }

  disconnect() { }
}
