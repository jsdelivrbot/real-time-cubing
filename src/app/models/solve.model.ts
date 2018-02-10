export enum Penalty {
  None = 'none',
  PlusTwo = '+2',
  DNF = 'DNF'
}

export interface Solve {
  userId: string;
  time: number;
  scramble: string;
  penalty: Penalty;
  index: number;
}
