import type { Units, WeatherPayload, WidgetConfig } from '@weather-widget/shared';
import { getWeatherIconClass } from '@weather-widget/shared';

interface OpenWeatherResponse {
  name: string;
  weather: Array<{ id: number; main: string; description: string }>;
  main: { temp: number; humidity: number; temp_min: number; temp_max: number };
  wind: { speed: number; deg: number };
  dt: number;
}

interface OpenMeteoForecast {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

interface OpenMeteoGeocode {
  results?: Array<{ name: string; admin1?: string; country?: string }>;
}

const WMO_TO_OPENWEATHER_ID: Record<number, number> = {
  0: 800,
  1: 801,
  2: 802,
  3: 803,
  45: 741,
  48: 741,
  51: 300,
  53: 300,
  55: 300,
  61: 500,
  63: 500,
  65: 500,
  71: 600,
  73: 600,
  75: 600,
  80: 500,
  81: 500,
  82: 500,
  95: 200,
  96: 200,
  99: 200,
};

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: 'clear sky',
  1: 'mainly clear',
  2: 'partly cloudy',
  3: 'overcast',
  45: 'fog',
  48: 'depositing rime fog',
  51: 'light drizzle',
  53: 'moderate drizzle',
  55: 'dense drizzle',
  61: 'slight rain',
  63: 'moderate rain',
  65: 'heavy rain',
  71: 'slight snow',
  73: 'moderate snow',
  75: 'heavy snow',
  80: 'slight rain showers',
  81: 'moderate rain showers',
  82: 'violent rain showers',
  95: 'thunderstorm',
  96: 'thunderstorm with slight hail',
  99: 'thunderstorm with heavy hail',
};


async function fetchFromOpenWeather(
  apiKey: string,
  lat: number,
  lon: number,
  units: Units,
): Promise<OpenWeatherResponse> {
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

async function fetchFromOpenMeteo(lat: number, lon: number, units: Units) {
  const temperatureUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
  const windSpeedUnit = units === 'imperial' ? 'mph' : 'ms';

  const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
  forecastUrl.searchParams.set('latitude', String(lat));
  forecastUrl.searchParams.set('longitude', String(lon));
  forecastUrl.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code',
  );
  forecastUrl.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min');
  forecastUrl.searchParams.set('temperature_unit', temperatureUnit);
  forecastUrl.searchParams.set('wind_speed_unit', windSpeedUnit);
  forecastUrl.searchParams.set('timezone', 'auto');

  const geocodeUrl = new URL('https://geocoding-api.open-meteo.com/v1/reverse');
  geocodeUrl.searchParams.set('latitude', String(lat));
  geocodeUrl.searchParams.set('longitude', String(lon));

  const [forecastResponse, geocodeResponse] = await Promise.all([
    fetch(forecastUrl),
    fetch(geocodeUrl),
  ]);

  if (!forecastResponse.ok) {
    throw new Error(`Open-Meteo API error: ${forecastResponse.status}`);
  }

  const forecast = (await forecastResponse.json()) as OpenMeteoForecast;
  const geocode = geocodeResponse.ok
    ? ((await geocodeResponse.json()) as OpenMeteoGeocode)
    : { results: [] };

  const place = geocode.results?.[0];
  const city = place
    ? [place.name, place.admin1, place.country].filter(Boolean).join(', ')
    : 'Your location';

  const weatherCode = forecast.current.weather_code;
  const openWeatherId = WMO_TO_OPENWEATHER_ID[weatherCode] ?? 800;

  return {
    name: city,
    weather: [
      {
        id: openWeatherId,
        main: WMO_DESCRIPTIONS[weatherCode] ?? 'Weather',
        description: WMO_DESCRIPTIONS[weatherCode] ?? 'current conditions',
      },
    ],
    main: {
      temp: forecast.current.temperature_2m,
      humidity: forecast.current.relative_humidity_2m,
      temp_min: forecast.daily.temperature_2m_min[0],
      temp_max: forecast.daily.temperature_2m_max[0],
    },
    wind: {
      speed: forecast.current.wind_speed_10m,
      deg: forecast.current.wind_direction_10m,
    },
    dt: Math.floor(new Date(forecast.current.time).getTime() / 1000),
  } satisfies OpenWeatherResponse;
}

function toWeatherPayload(config: WidgetConfig, data: OpenWeatherResponse): WeatherPayload {
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
    windSpeed: Number(data.wind.speed.toFixed(1)),
    windDeg: data.wind.deg,
    observedAt: new Date(data.dt * 1000).toLocaleString(),
  };
}

export async function getWeatherPayload(
  apiKey: string,
  config: WidgetConfig,
): Promise<WeatherPayload> {
  try {
    if (apiKey) {
      const data = await fetchFromOpenWeather(apiKey, config.lat, config.lon, config.units);
      return toWeatherPayload(config, data);
    }
  } catch {
    // Fall through to Open-Meteo when OpenWeather is unavailable.
  }

  const data = await fetchFromOpenMeteo(config.lat, config.lon, config.units);
  return toWeatherPayload(config, data);
}

// Keep exports used by tests/internal callers.
export { fetchFromOpenWeather as fetchCurrentWeather, toWeatherPayload };
