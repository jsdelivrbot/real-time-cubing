export enum SolveState {
  Initial,
  Inspection,
  Solve,
  Finished
}

export interface Solve {
  userId: string;
  time: number;
  scramble: string;
  index: number;
}
