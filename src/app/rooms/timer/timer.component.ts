import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

import { SolveState, Solve } from '../../models/solve.model';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {
  @Input() scramble: string;
  @Output() solve = new EventEmitter<Solve>();
  startTime: number;
  time: number;
  display: string;
  penalty: string;
  state: SolveState;
  inspectionTimers: NodeJS.Timer[];
  SolveState = SolveState;

  constructor() {
    this.reset();
  }

  startInspection(): void {
    this.state = SolveState.Inspection;
    this.display = 'Inspection';
    this.inspectionTimers = [
      setTimeout(() => this.display = 'Inspection 8s!', 8000),
      setTimeout(() => this.display = 'Inspection 12s!', 12000),
      setTimeout(() => this.display = 'Inspection +2!', 15000),
      setTimeout(() => this.display = 'Inspection DNF!', 17000)
    ];
  }

  start(): void {
    this.state = SolveState.Solve;
    this.startTime = performance.now();
    this.display = 'Solving';
    this.inspectionTimers.forEach(timer => clearTimeout(timer));
  }

  stop(): void {
    this.state = SolveState.Finished;
    const timeMiliseconds = (performance.now() - this.startTime);
    this.time = _.floor(timeMiliseconds / 1000, 2);
    this.display = this.time.toString();
  }

  submitTime(): void {
    /* Notify about the time. */
    const solve = { time: this.time, scramble: this.scramble } as Solve;
    this.solve.emit(solve);
    this.reset();
    this.scramble = null;
  }

  private reset(): void {
    this.startTime = null;
    this.time = null;
    this.display = '';
    this.penalty = 'None';
    this.state = SolveState.Initial;
  }
}
