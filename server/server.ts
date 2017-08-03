import * as path from 'path';
import * as http from 'http';
import * as express from 'express';
import * as request from 'superagent';
import * as jsonwebtoken from 'jsonwebtoken';
import * as socketIo from 'socket.io';
import * as socketIoJwt from 'socketio-jwt';

import { environment } from './environment';
import { parseWcaUser } from './helpers';

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const staticFilesPath = path.resolve(__dirname, '../dist');
const indexHtmlPath = path.resolve(staticFilesPath, 'index.html');

app.use(express.static(staticFilesPath));

io.use(socketIoJwt.authorize({
  secret: environment.jwtSecret,
  handshake: true
}));

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
    .then(response => response.body.me)
    .then(user => {
      const token = jsonwebtoken.sign({ user: parseWcaUser(user) }, environment.jwtSecret);
      res.send(`
        <script>
          localStorage.setItem('jwt', '${token}');
          window.close();
        </script>
      `);
    });
});

app.get('/*', (req, res) => {
  res.sendFile(indexHtmlPath);
});

const rooms = [];

io.on('connection', socket => {
  socket.emit('initialRooms', rooms);

  socket.on('createRoom', room => {
    rooms.push(room);
    socket.join(room.name);
    socket.broadcast.emit('newRoom', room);
  });
});

server.listen(environment.port, () => console.log(`App running on port ${environment.port}`));
