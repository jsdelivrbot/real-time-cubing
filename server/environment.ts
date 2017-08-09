export const environment: any = {};

/* Copy environment data from the client code and add the server specific, mostly secret one. */
import { environment as development } from '../src/environments/environment';
import { environment as production } from '../src/environments/environment.prod';

if (process.env.NODE_ENV === 'production') {
  Object.assign(environment, production, {
    port: process.env.PORT,
    wcaOAuthClientSecret: process.env.WCA_OAUTH_SECRET,
    jwtSecret: process.env.JWT_SECRET,
    mongodbUri: process.env.MONGODB_URI
  });
} else {
  Object.assign(environment, development, {
    port: 3000,
    wcaOAuthClientSecret: '2196f102f10f62344b8f428c62e4d8a490b5d23b750de931a91c65d3db1e3d3c',
    jwtSecret: 'secret',
    mongodbUri: 'mongodb://localhost:27017/realtimecubing_development',
  });
}
