import type { Units, WeatherPayload, WidgetConfig } from '@weather-widget/shared';
import { getWeatherIconClass } from '@weather-widget/shared';

interface OpenWeatherResponse {
  name: string;
  weather: Array<{ id: number; main: string; description: string }>;
  main: { temp: number; humidity: number; temp_min: number; temp_max: number };
  wind: { speed: number; deg: number };
  dt: number;
}

export async function fetchCurrentWeather(
  apiKey: string,
  lat: number,
  lon: number,
  units: Units,
): Promise<OpenWeatherResponse> {
  if (!apiKey) {
    throw new Error('OPENWEATHER_API_KEY is not configured');
  }

  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));
  url.searchParams.set('units', units);
  url.searchParams.set('appid', apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`OpenWeather API error: ${response.status}`);
  }

  return response.json() as Promise<OpenWeatherResponse>;
}

export function toWeatherPayload(
  config: WidgetConfig,
  data: OpenWeatherResponse,
): WeatherPayload {
  const weather = data.weather[0];

  return {
    title: config.title,
    city: data.name,
    main: weather.main,
    description: weather.description,
    iconClass: getWeatherIconClass(weather.id),
    temp: Math.round(data.main.temp),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    showWind: config.showWind,
    units: config.units,
    windSpeed: data.wind.speed,
    windDeg: data.wind.deg,
    observedAt: new Date(data.dt * 1000).toLocaleString(),
  };
}
