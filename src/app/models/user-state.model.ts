export enum State {
  Ready = 'ready',
  Scrambling = 'scrambling',
  Inspecting = 'inspecting',
  Solving = 'solving',
  Spectating = 'spectating'
}

export interface UserState {
  userId: string;
  state: State;
}
