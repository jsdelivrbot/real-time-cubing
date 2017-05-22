export interface User {
  id: number;
  name: string;
  wcaId: string;
  countryIso2: string;
  wcaUrl: string;
  avatar: {
    thumbUrl: string,
    url: string
  };
}
