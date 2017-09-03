import { Component, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {
  // @Input() scramble: string;
  scramble = "D' B2 L2 U B2 D2 R2 D2 R2 U2 R B' L2 F' U B2 R B' D2 B' R";
  inspection: number;
  startTime: number;
  display = '';
  inspectionTimers: NodeJS.Timer[];
  penalty = 'OK';

  constructor() { }

  startInspection(): void {
    this.display = 'Inspection';
    this.inspectionTimers = [
      setTimeout(() => this.display = 'Inspection 8s!', 8000),
      setTimeout(() => this.display = 'Inspection 12s!', 12000),
      setTimeout(() => this.display = 'Inspection +2!', 15000),
      setTimeout(() => this.display = 'Inspection DNF!', 17000)
    ];
  }

  start(): void {
    this.startTime = performance.now();
    this.display = 'Solving';
    this.inspectionTimers.forEach(timer => clearTimeout(timer));
  }

  stop(): void {
    const timeMiliseconds = (performance.now() - this.startTime);
    const time = _.floor(timeMiliseconds / 1000, 2);
    this.display = time.toString();
  }

  submitTime(): void {
    /* Notify about the time. */
  }
}
