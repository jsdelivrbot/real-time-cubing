import * as request from 'superagent';
import * as jsonwebtoken from 'jsonwebtoken';

import { environment } from './environment';
import { parseWcaUser } from './helpers';

export function configureRoutes(app, db) {
  app.get('/oauth-callback', (req, res) => {
    request
      .post('https://www.worldcubeassociation.org/oauth/token')
      .query({
        client_id: environment.wcaOAuthClientId,
        client_secret: environment.wcaOAuthClientSecret,
        code: req.query.code,
        grant_type: 'authorization_code',
        redirect_uri: `${environment.baseUrl}/oauth-callback`
      })
      .then(response => response.body.access_token)
      .then(accessToken =>
        request
          .get('https://www.worldcubeassociation.org/api/v0/me')
          .set('Authorization', `Bearer ${accessToken}`))
      .then(response => parseWcaUser(response.body.me))
      .then(user => db.collection('users').findOneAndReplace({ id: user.id }, user, { upsert: true, returnOriginal: false }))
      .then(({ value: user }) => {
        const token = jsonwebtoken.sign({ user }, environment.jwtSecret);
        res.send(`
          <script>
            localStorage.setItem('jwt', '${token}');
            window.close();
          </script>
        `);
      });
  });
};
