import * as _ from 'lodash';
import * as Scrambler from 'scrambo';

import { SimplifiedRoom, Room } from '../src/app/models/room.model';
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

export const simplifiedRoomFieldsOptions = { fields: { _id: 1, name: 1, public: 1, event: 1 } };

export function toSimplifiedRoom(room: Room): SimplifiedRoom {
  return _.pick(room, _.keys(simplifiedRoomFieldsOptions.fields)) as SimplifiedRoom;
}

/* Scrambler wrapper. */
const lengthByEventId = { '444': 40, '555': 60, '666': 80, '777': 100, 'minx': 70 };
export function scrambleFor(eventId) {
  const scrambler = new Scrambler();
  const scramblerEventId = eventId.replace(/(bf|fm|ft|oh)$/, '');
  const length = lengthByEventId[scramblerEventId];
  if (length) {
    scrambler.length(length);
  }
  return scrambler.type(scramblerEventId).get()[0];
}
