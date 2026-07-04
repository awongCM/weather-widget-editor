import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../index.js';

describe('API routes', () => {
  it('returns health status', async () => {
    const app = createApp();
    await request(app).get('/api/health').expect(200, { status: 'ok' });
  });

  it('rejects invalid weather requests', async () => {
    const app = createApp();

    await request(app)
      .post('/api/weather')
      .send({ title: '', units: 'metric', showWind: true, lat: 0, lon: 0 })
      .expect(400);
  });

  it('generates embed snippets', async () => {
    const app = createApp();

    const response = await request(app)
      .post('/api/widgets/snippet')
      .send({
        title: 'My Widget',
        units: 'metric',
        showWind: true,
        lat: -33.87,
        lon: 151.21,
      })
      .expect(200);

    expect(response.body.snippet).toContain('weather-widget-loader');
    expect(response.body.snippet).toContain('weather-widget-content');
  });
});
