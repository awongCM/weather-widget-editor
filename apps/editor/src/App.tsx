import { useState } from 'react';
import type { Units, WeatherPayload, WidgetConfig } from '@weather-widget/shared';
import { createSnippet, fetchWeather } from './api/client';
import { WidgetCard, WidgetEditor } from './components/WidgetEditor';
import { useGeolocation } from './hooks/useGeolocation';

interface SavedWidget {
  id: string;
  title: string;
  snippet: string;
  weather: WeatherPayload | null;
  error: string | null;
}

export default function App() {
  const geo = useGeolocation();
  const [widgets, setWidgets] = useState<SavedWidget[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationReady = geo.lat !== null && geo.lon !== null;

  async function handleCreateWidget(values: { title: string; units: Units; showWind: boolean }) {
    if (!locationReady) {
      return;
    }

    const config: WidgetConfig = {
      title: values.title,
      units: values.units,
      showWind: values.showWind,
      lat: geo.lat!,
      lon: geo.lon!,
    };

    setIsSubmitting(true);

    try {
      const [snippet, weather] = await Promise.all([
        createSnippet(config),
        fetchWeather(config),
      ]);

      setWidgets((current) => [
        {
          id: crypto.randomUUID(),
          title: values.title,
          snippet,
          weather,
          error: null,
        },
        ...current,
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create widget';

      setWidgets((current) => [
        {
          id: crypto.randomUUID(),
          title: values.title,
          snippet: '',
          weather: null,
          error: message,
        },
        ...current,
      ]);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-6xl gap-8 px-6 py-10 lg:grid-cols-2">
      <section>
        <WidgetEditor
          disabled={!locationReady || isSubmitting}
          onSubmit={handleCreateWidget}
        />

        {geo.loading && <p className="mt-4 text-sm text-slate-400">Detecting your location…</p>}
        {geo.error && (
          <p className="mt-4 text-sm text-rose-400">
            Location error: {geo.error}. Enable location access to build widgets.
          </p>
        )}
        {locationReady && (
          <p className="mt-4 text-sm text-slate-500">
            Using location: {geo.lat?.toFixed(4)}, {geo.lon?.toFixed(4)}
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Your widgets</h2>
        {widgets.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-700 p-6 text-slate-400">
            Created widgets and embed snippets will appear here.
          </p>
        ) : (
          <div className="space-y-4">
            {widgets.map((widget) => (
              <WidgetCard
                key={widget.id}
                title={widget.title}
                snippet={widget.snippet}
                weather={widget.weather}
                error={widget.error}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
