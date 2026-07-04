const WEATHER_ICON_MAP: Record<number, string> = {
  200: 'wi-thunderstorm',
  300: 'wi-sleet',
  500: 'wi-rain',
  600: 'wi-snow',
  741: 'wi-fog',
  800: 'wi-day-sunny',
  801: 'wi-day-cloudy',
  802: 'wi-cloud',
  803: 'wi-cloudy',
  804: 'wi-cloudy',
  900: 'wi-tornado',
  901: 'wi-storm-showers',
  902: 'wi-hurricane',
  903: 'wi-snowflake-cold',
  904: 'wi-hot',
  905: 'wi-windy',
  906: 'wi-hail',
};

export function getWeatherIconClass(weatherId: number): string {
  const exact = WEATHER_ICON_MAP[weatherId];
  if (exact) {
    return `wi ${exact}`;
  }

  const bucket = Math.floor(weatherId / 100) * 100;
  const bucketIcon = WEATHER_ICON_MAP[bucket];
  return bucketIcon ? `wi ${bucketIcon}` : 'wi wi-na';
}

export function getTemperatureUnitIcon(units: 'metric' | 'imperial'): string {
  return units === 'metric' ? 'wi-celsius' : 'wi-fahrenheit';
}

export function getWindSpeedLabel(units: 'metric' | 'imperial'): string {
  return units === 'metric' ? 'm/s' : 'mph';
}
