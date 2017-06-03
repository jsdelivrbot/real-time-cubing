import { User } from './user.model';
import { WcaEvent } from './wca-event.model';

export interface Room {
  name: string;
  public: boolean;
  event: WcaEvent;
  users: User[];
}
