# Weather Widget Editor

A modernized weather widget builder. Configure a widget in the browser, preview live weather for your location, and copy an embed snippet into any HTML page.

Originally a 2016 Viocorp/Viostream coding assignment; rebuilt with current tooling in 2026.

## Stack

- **Editor:** Vite, React 19, TypeScript, Tailwind CSS 4
- **API:** Express 5, TypeScript
- **Embed widget:** Standalone IIFE bundle (no jQuery)
- **Shared:** Validation, types, weather icon mapping
- **Tests:** Vitest, supertest

## Monorepo layout

```
apps/
  editor/     React editor UI
  embed/      Embeddable widget script
packages/
  api/        Express REST API
  shared/     Shared types and validation
legacy/       Original 2016 implementation (archived)
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Set `OPENWEATHER_API_KEY` to a valid [OpenWeatherMap](https://openweathermap.org/api) key.

### 3. Development

Run the API and editor together:

```bash
npm run dev
```

- Editor: http://localhost:5173
- API: http://localhost:9090

The Vite dev server proxies `/api` and `/embed` to the API.

### 4. Production build

```bash
npm run build
npm start
```

This builds all packages and serves the editor, API, and embed assets from port `9090`.

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/weather` | POST | Fetch weather JSON for widget config |
| `/api/widgets/snippet` | POST | Generate embed HTML snippet |

### Example weather request

```json
{
  "title": "Sydney Weather",
  "units": "metric",
  "showWind": true,
  "lat": -33.87,
  "lon": 151.21
}
```

## Embed usage

Paste the generated snippet into any HTML page:

```html
<script id="weather-widget-loader" src="http://localhost:9090/embed/widget.js" data-title="My Widget" data-units="metric" data-show-wind="true" data-lat="-33.87" data-lon="151.21"></script>
<div id="weather-widget-content"></div>
```

## Tests

```bash
npm test
```

## Legacy code

The original Gulp/Bower/jQuery/Handlebars implementation is preserved under `legacy/` for reference.

## License

MIT — see [LICENSE](LICENSE).
