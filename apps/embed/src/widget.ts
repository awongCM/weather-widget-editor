import type { WeatherPayload } from '@weather-widget/shared';
import { getTemperatureUnitIcon, getWindSpeedLabel } from '@weather-widget/shared';
import './widget.css';

function getLoaderScript(): HTMLScriptElement | null {
  const script =
    document.currentScript instanceof HTMLScriptElement
      ? document.currentScript
      : document.getElementById('weather-widget-loader');

  return script instanceof HTMLScriptElement ? script : null;
}

function getApiBase(script: HTMLScriptElement): string {
  const url = new URL(script.src);
  return `${url.protocol}//${url.host}`;
}

function readConfig(script: HTMLScriptElement) {
  return {
    title: script.dataset.title ?? 'Weather',
    units: (script.dataset.units === 'imperial' ? 'imperial' : 'metric') as 'metric' | 'imperial',
    showWind: script.dataset.showWind === 'true',
    lat: Number(script.dataset.lat),
    lon: Number(script.dataset.lon),
  };
}

function renderWeather(container: HTMLElement, weather: WeatherPayload): void {
  const unitIcon = getTemperatureUnitIcon(weather.units);
  const windLabel = getWindSpeedLabel(weather.units);

  container.innerHTML = `
    <div class="ww-widget">
      <h2 class="ww-title">${escapeHtml(weather.title)}</h2>
      <div class="ww-header">
        <div>
          <p class="ww-city">${escapeHtml(weather.city)}</p>
          <p class="ww-description">${escapeHtml(weather.description)}</p>
          <p class="ww-time">${escapeHtml(weather.observedAt)}</p>
        </div>
        <div class="ww-temp-block">
          <i class="${weather.iconClass} ww-icon"></i>
          <p class="ww-temp">${weather.temp}<i class="wi ${unitIcon}"></i></p>
        </div>
      </div>
      <div class="ww-grid">
        <div class="ww-stat">
          <span>Min / Max</span>
          <strong>${weather.tempMin} / ${weather.tempMax}<i class="wi ${unitIcon}"></i></strong>
        </div>
        <div class="ww-stat">
          <span>Humidity</span>
          <strong>${weather.humidity}%</strong>
        </div>
        ${
          weather.showWind
            ? `<div class="ww-stat ww-stat-wide">
                <span>Wind</span>
                <strong>${weather.windSpeed} ${windLabel} · ${weather.windDeg}°</strong>
              </div>`
            : ''
        }
      </div>
    </div>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function injectStylesheet(apiBase: string): void {
  if (!document.getElementById('weather-widget-styles')) {
    const widgetCss = document.createElement('link');
    widgetCss.id = 'weather-widget-styles';
    widgetCss.rel = 'stylesheet';
    widgetCss.href = `${apiBase}/embed/widget.css`;
    document.head.append(widgetCss);
  }

  if (!document.getElementById('weather-widget-icon-styles')) {
    const iconCss = document.createElement('link');
    iconCss.id = 'weather-widget-icon-styles';
    iconCss.rel = 'stylesheet';
    iconCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.12/css/weather-icons.min.css';
    document.head.append(iconCss);
  }
}

const loaderScript = getLoaderScript();

async function loadWeatherWidget(): Promise<void> {
  const script = loaderScript ?? getLoaderScript();
  const container = document.getElementById('weather-widget-content');

  if (!script || !container) {
    console.error('Weather widget: missing loader script or #weather-widget-content container.');
    return;
  }

  const apiBase = getApiBase(script);
  const config = readConfig(script);

  injectStylesheet(apiBase);

  try {
    const response = await fetch(`${apiBase}/api/weather`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? 'Weather lookup failed');
    }

    renderWeather(container, data as WeatherPayload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Weather lookup failed';
    container.innerHTML = `<div class="ww-error">${escapeHtml(message)}</div>`;
  }
}

function startWidget(): void {
  void loadWeatherWidget();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startWidget);
} else {
  startWidget();
}
