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
