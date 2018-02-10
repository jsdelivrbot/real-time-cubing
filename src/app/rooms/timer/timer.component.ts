import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

import { Solve, Penalty } from '../../models/solve.model';
import { State } from '../../models/user-state.model';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {
  @Input() scramble: string;
  @Output() solve = new EventEmitter<Solve>();
  @Output() stateChange = new EventEmitter<State>();
  startTime: number;
  time: number;
  display: string;
  penalty: Penalty;
  state: State;
  inspectionTimers: NodeJS.Timer[];
  /* Make enums available for the view. */
  State = State;
  Penalty = Penalty;

  constructor() {
    this.reset();
  }

  startInspection(): void {
    this.setAndEmitState(State.Inspecting);
    this.display = 'Inspection';
    this.inspectionTimers = [
      setTimeout(() => this.display = 'Inspection 8s!', 8000),
      setTimeout(() => this.display = 'Inspection 12s!', 12000),
      setTimeout(() => this.display = 'Inspection +2!', 15000),
      setTimeout(() => this.display = 'Inspection DNF!', 17000)
    ];
  }

  start(): void {
    this.setAndEmitState(State.Solving);
    this.startTime = performance.now();
    this.display = 'Solving';
    this.inspectionTimers.forEach(timer => clearTimeout(timer));
  }

  stop(): void {
    const timeMiliseconds = (performance.now() - this.startTime);
    this.time = _.floor(timeMiliseconds / 1000, 2);
    this.display = this.time.toString();
  }

  submitTime(): void {
    this.setAndEmitState(State.Ready);
    /* Notify about the time. */
    const solve = { time: this.time, scramble: this.scramble, penalty: this.penalty } as Solve;
    this.solve.emit(solve);
    this.reset();
    this.scramble = null;
  }

  private reset(): void {
    this.startTime = null;
    this.time = null;
    this.display = null;
    this.penalty = Penalty.None;
    this.state = State.Scrambling;
  }

  private setAndEmitState(state: State) {
    this.state = state;
    this.stateChange.emit(state);
  }
}
