import { Message } from './message.model';
import { User } from './user.model';
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
}
