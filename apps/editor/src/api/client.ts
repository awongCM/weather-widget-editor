import type { SnippetResponse, WeatherPayload, WidgetConfig } from '@weather-widget/shared';

async function parseJson<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error((data as { error?: string }).error ?? 'Request failed');
  }

  return data as T;
}

export async function createSnippet(config: WidgetConfig): Promise<string> {
  const response = await fetch('/api/widgets/snippet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });

  const data = await parseJson<SnippetResponse>(response);
  return data.snippet;
}

export async function fetchWeather(config: WidgetConfig): Promise<WeatherPayload> {
  const response = await fetch('/api/weather', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });

  return parseJson<WeatherPayload>(response);
}
