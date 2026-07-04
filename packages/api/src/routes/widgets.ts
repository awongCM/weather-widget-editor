import {
  areUnitsValid,
  isLatitudeValid,
  isLongitudeValid,
  isShowWindValid,
  isTitleValid,
  parseShowWind,
  type WidgetConfig,
} from '@weather-widget/shared';
import type { Request, Response } from 'express';
import { config } from '../config.js';
import { fetchCurrentWeather, toWeatherPayload } from '../services/openWeather.js';

function parseWidgetConfig(body: Record<string, unknown>): WidgetConfig | null {
  const title = body.title;
  const units = body.units;
  const showWind = body.showWind;
  const lat = typeof body.lat === 'string' ? Number(body.lat) : body.lat;
  const lon = typeof body.lon === 'string' ? Number(body.lon) : body.lon;

  if (
    !isTitleValid(title) ||
    !areUnitsValid(units) ||
    !isShowWindValid(showWind) ||
    !isLatitudeValid(lat) ||
    !isLongitudeValid(lon)
  ) {
    return null;
  }

  return {
    title,
    units,
    showWind: parseShowWind(showWind),
    lat,
    lon,
  };
}

export function generateSnippet(widget: WidgetConfig): string {
  const attrs = [
    `data-title="${escapeAttr(widget.title)}"`,
    `data-units="${widget.units}"`,
    `data-show-wind="${widget.showWind}"`,
    `data-lat="${widget.lat}"`,
    `data-lon="${widget.lon}"`,
  ].join(' ');

  const scriptSrc = `${config.publicUrl}/embed/widget.js`;

  return [
    `<script id="weather-widget-loader" src="${scriptSrc}" ${attrs}></script>`,
    '<div id="weather-widget-content"></div>',
  ].join('\n');
}

function escapeAttr(value: string): string {
  return value.replace(/"/g, '&quot;');
}

export async function postWeather(req: Request, res: Response): Promise<void> {
  const widget = parseWidgetConfig(req.body as Record<string, unknown>);

  if (!widget) {
    res.status(400).json({ error: 'One or more input fields are invalid.' });
    return;
  }

  try {
    const data = await fetchCurrentWeather(
      config.openWeatherApiKey,
      widget.lat,
      widget.lon,
      widget.units,
    );
    res.json(toWeatherPayload(widget, data));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Weather lookup failed';
    res.status(502).json({ error: message });
  }
}

export function postSnippet(req: Request, res: Response): void {
  const widget = parseWidgetConfig(req.body as Record<string, unknown>);

  if (!widget) {
    res.status(400).json({ error: 'One or more input fields are invalid.' });
    return;
  }

  res.json({ snippet: generateSnippet(widget) });
}
