import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { postSnippet, postWeather } from './routes/widgets.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const editorDist = path.join(repoRoot, 'apps/editor/dist');
const embedDist = path.join(repoRoot, 'apps/embed/dist');

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/weather', postWeather);
  app.post('/api/widgets/snippet', postSnippet);

  app.use('/embed', express.static(embedDist));
  app.use(express.static(editorDist));

  app.get('/{*path}', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      next();
      return;
    }

    res.sendFile(path.join(editorDist, 'index.html'), (error) => {
      if (error) {
        next();
      }
    });
  });

  return app;
}

export function startServer() {
  const app = createApp();

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`Weather Widget API listening on http://0.0.0.0:${config.port}`);
  });

  return app;
}
