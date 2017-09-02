import * as _ from 'lodash';

import { Room, RoomExtended } from '../src/app/models/room.model';
import { User } from '../src/app/models/user.model';

export function parseWcaUser(user: any): User {
  return <User>{
    id: user.id,
    name: user.name,
    wcaId: user.wca_id,
    countryIso2: user.country_iso2,
    wcaUrl: user.url,
    avatar: {
      thumbUrl: user.avatar.thumb_url,
      url: user.avatar.url
    }
  };
};

export const basicRoomFieldsOptions = { fields: { _id: 1, name: 1, public: 1, event: 1 } };

export function toBasicRoom(room: RoomExtended): Room {
  return _.pick(room, _.keys(basicRoomFieldsOptions.fields)) as Room;
}
