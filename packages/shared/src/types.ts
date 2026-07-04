export type Units = 'metric' | 'imperial';

export interface GeoLocation {
  lat: number;
  lon: number;
}

export interface WidgetConfig {
  title: string;
  units: Units;
  showWind: boolean;
  lat: number;
  lon: number;
}

export interface WeatherPayload {
  title: string;
  city: string;
  main: string;
  description: string;
  iconClass: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  showWind: boolean;
  units: Units;
  windSpeed: number;
  windDeg: number;
  observedAt: string;
}

export interface SnippetResponse {
  snippet: string;
}

export interface ApiError {
  error: string;
}
