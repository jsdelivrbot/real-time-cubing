import { Message } from './message.model';
import { Solve } from './solve.model';
import { User } from './user.model';
import { UserState } from './user-state.model';
import { WcaEvent } from './wca-event.model';

export interface SimplifiedRoom {
  _id: string;
  name: string;
  public: boolean;
  event: WcaEvent;
}

export interface Room extends SimplifiedRoom {
  users: User[];
  messages: Message[];
  solves: Solve[];
  userStates: UserState[];
}
