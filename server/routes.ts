import * as request from 'superagent';
import * as jsonwebtoken from 'jsonwebtoken';
import { ObjectID } from 'mongodb';
import * as _ from 'lodash';

import { environment } from './environment';
import { parseWcaUser } from './helpers';

export function configureRoutes(app, io, db) {
  app.get('/oauth-callback', (req, res) => {
    request
      .post(`${environment.wcaUrl}/oauth/token`)
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
          .get(`${environment.wcaUrl}/api/v0/me`)
          .set('Authorization', `Bearer ${accessToken}`))
      .then(response => parseWcaUser(response.body.me))
      .then(user => db.collection('users').findOneAndReplace({ id: user.id }, user, { upsert: true, returnOriginal: false }))
      .then(({ value: user }) => {
        const data = { user };
        const token = jsonwebtoken.sign(data, environment.jwtSecret);
        res.send(`
          <script>
            localStorage.setItem('jwt', '${token}');
            window.close();
          </script>
        `);
      });
  });

  app.post('/api/rooms', (req, res) => {
    const newRoom = _.extend(req.body, { users: [], messages: [] });
    db.collection('rooms').insertOne(newRoom).then(({ ops: [room] }) => {
      io.sockets.emit('roomCreated', room);
      res.json(room);
    });
  });

  app.get('/api/rooms/:id', (req, res) => {
    db.collection('rooms').findOne({ _id: new ObjectID(req.params.id) }).then(room => {
      if (!room) {
        res.status(404).send({ error: 'Room not found.' });
      } else {
        res.json(room);
      }
    });
  });
}
