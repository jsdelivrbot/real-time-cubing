export enum SolveState {
  Initial,
  Inspection,
  Solve,
  Finished
}

export interface Solve {
  time: number;
  scramble: string;
  index: number;
}
