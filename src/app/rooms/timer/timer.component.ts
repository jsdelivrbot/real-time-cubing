import { Component, Input } from '@angular/core';
import * as _ from 'lodash';

enum SolveState {
  Initial,
  Inspection,
  Solve,
  Finished
}

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {
  // @Input() scramble: string;
  scramble = "D' B2 L2 U B2 D2 R2 D2 R2 U2 R B' L2 F' U B2 R B' D2 B' R";
  startTime: number;
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
    const time = _.floor(timeMiliseconds / 1000, 2);
    this.display = time.toString();
  }

  submitTime(): void {
    /* Notify about the time. */
    this.reset();
    this.scramble = null;
  }

  private reset(): void {
    this.startTime = null;
    this.display = '';
    this.penalty = 'None';
    this.state = SolveState.Initial;
  }
}
