export enum State {
  Ready,
  Scrambling,
  Inspecting,
  Solving,
  Spectating
}

export interface UserState {
  userId: string;
  state: State;
}
