import * as express from 'express';
import * as path from 'path';
import * as request from 'superagent';
import * as jsonwebtoken from 'jsonwebtoken';

const app = express();

const staticFilesPath = path.resolve(__dirname, '../dist');
const indexHtmlPath = path.resolve(staticFilesPath, 'index.html');
const port = process.env.port || 3000;

app.use(express.static(staticFilesPath));

app.get('/oauth-callback', (req, res) => {
  request
    .post('https://staging.worldcubeassociation.org/oauth/token')
    .query({
      client_id: 'd77dacb2f4e24aa7b44533fcf66733bfd637dcb0cd55809879ced2128a35f59b',
      client_secret: 'ede9032c84ba2f7b3fddf307e7a6e23107b599729936e66f542e4f2f0e072ebf',
      code: req.query.code,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:4200/oauth-callback'
    })
    .then(response => response.body.access_token)
    .then(access_token =>
      request
        .get('https://staging.worldcubeassociation.org/api/v0/me')
        .set('Authorization', `Bearer ${access_token}`))
    .then(response => response.body.me)
    .then(user => {
      const token = jsonwebtoken.sign(user, 'secret');
      const data = JSON.stringify({ jwt: token, user });
      res.send(`
        <script>
          window.opener.postMessage(${data}, 'http://localhost:4200');
          window.close();
        </script>
      `);
    });
});

app.get('/*', (req, res) => {
  res.sendFile(indexHtmlPath);
});

app.listen(port, () => console.log(`App running on port ${port}`));
