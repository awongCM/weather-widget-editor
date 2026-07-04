# Weather Widget Editor Modernization Design

**Date:** 2026-07-04  
**Status:** Approved (Option A)

## Goal

Replace the 2016 Gulp/Bower/jQuery/Handlebars stack with a modern monorepo while preserving core behavior: configure a weather widget, copy embed code, display live weather via OpenWeatherMap.

## Architecture

npm workspaces monorepo:

| Package | Purpose |
|---------|---------|
| `packages/shared` | TypeScript types, input validation, weather icon mapping |
| `packages/api` | Express REST API, OpenWeather integration, snippet generation |
| `apps/editor` | Vite + React + TypeScript editor UI |
| `apps/embed` | Standalone IIFE embed script (no framework) |

### Data flow

1. Editor collects title, units, showWind, geolocation.
2. `POST /api/widgets/snippet` returns embed HTML snippet.
3. Embedded page loads `widget.js`, which `POST /api/weather` with config.
4. API fetches OpenWeatherMap, returns JSON; embed script renders DOM.

### API endpoints

- `GET /api/health` — health check
- `POST /api/weather` — weather JSON for widget
- `POST /api/widgets/snippet` — embed code generation

### Production

Express serves built editor (`apps/editor/dist`) and embed bundle (`apps/embed/dist`) as static assets.

## Tech stack

- Node 22+, TypeScript, npm workspaces
- Vite 6, React 19, Tailwind CSS 4
- Express 5, Vitest, supertest

## Non-goals

- User accounts, widget persistence, or database
- Changing core widget fields or OpenWeather provider

## Legacy

Original files moved to `legacy/` for reference; not used at runtime.
