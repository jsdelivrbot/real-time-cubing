import * as express from 'express';
import * as path from 'path';

const app = express();

const staticFilesPath = path.resolve(__dirname, '../dist');
const indexHtmlPath = path.resolve(staticFilesPath, 'index.html');
const port = process.env.port || 3000;

app.use(express.static(staticFilesPath));

app.get('/*', (req, res) => {
  res.sendFile(indexHtmlPath);
});

app.listen(port, () => console.log(`App running on port ${port}`));
