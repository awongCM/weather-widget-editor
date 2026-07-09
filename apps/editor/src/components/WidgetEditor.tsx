import type { Units, WeatherPayload } from '@weather-widget/shared';
import { getTemperatureUnitIcon, getWindSpeedLabel } from '@weather-widget/shared';

interface WeatherPreviewProps {
  weather: WeatherPayload;
}

export function WeatherPreview({ weather }: WeatherPreviewProps) {
  const unitIcon = getTemperatureUnitIcon(weather.units);
  const windLabel = getWindSpeedLabel(weather.units);

  return (
    <div className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-xl">
      <h2 className="text-2xl font-semibold text-sky-300">{weather.title}</h2>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xl font-medium">{weather.city}</p>
          <p className="text-slate-400 capitalize">{weather.description}</p>
          <p className="mt-2 text-sm text-slate-500">{weather.observedAt}</p>
        </div>
        <div className="text-right">
          <i className={`${weather.iconClass} text-5xl text-amber-300`} />
          <p className="mt-2 text-3xl font-bold">
            {weather.temp}
            <i className={`wi ${unitIcon} ml-1 text-2xl`} />
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="rounded-xl bg-slate-950/50 p-3">
          <p className="text-slate-400">Min / Max</p>
          <p>
            {weather.tempMin} / {weather.tempMax}
            <i className={`wi ${unitIcon} ml-1`} />
          </p>
        </div>
        <div className="rounded-xl bg-slate-950/50 p-3">
          <p className="text-slate-400">Humidity</p>
          <p>{weather.humidity}%</p>
        </div>
        {weather.showWind && (
          <div className="col-span-2 rounded-xl bg-slate-950/50 p-3">
            <p className="text-slate-400">Wind</p>
            <p>
              {weather.windSpeed} {windLabel} · {weather.windDeg}°
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface WidgetCardProps {
  title: string;
  snippet: string;
  weather: WeatherPayload | null;
  error: string | null;
}

export function WidgetCard({ title, snippet, weather, error }: WidgetCardProps) {
  async function copySnippet() {
    await navigator.clipboard.writeText(snippet);
  }

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          type="button"
          onClick={copySnippet}
          className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-medium hover:bg-sky-500"
        >
          Copy embed code
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-rose-400">{error}</p>}
      {weather && <WeatherPreview weather={weather} />}

      <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-300">
        {snippet}
      </pre>
    </article>
  );
}

interface WidgetEditorProps {
  disabled: boolean;
  onSubmit: (values: { title: string; units: Units; showWind: boolean }) => void;
}

export function WidgetEditor({ disabled, onSubmit }: WidgetEditorProps) {
  return (
    <form
      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        onSubmit({
          title: String(form.get('title') ?? ''),
          units: String(form.get('units') ?? 'metric') as Units,
          showWind: form.get('showWind') === 'on',
        });
        event.currentTarget.reset();
      }}
    >
      <h2 className="text-2xl font-semibold">Weather Widget Editor</h2>
      <p className="mt-2 text-sm text-slate-400">
        Configure a widget using your current location, then copy the embed snippet.
      </p>

      <label className="mt-6 block text-sm font-medium" htmlFor="title">
        Widget title
      </label>
      <input
        id="title"
        name="title"
        required
        autoComplete="off"
        disabled={disabled}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none ring-sky-500 focus:ring-2"
        placeholder="Sydney Weather"
      />

      <label className="mt-4 block text-sm font-medium" htmlFor="units">
        Units
      </label>
      <select
        id="units"
        name="units"
        disabled={disabled}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
        defaultValue="metric"
      >
        <option value="metric">Metric (°C)</option>
        <option value="imperial">Imperial (°F)</option>
      </select>

      <label className="mt-4 flex items-center gap-2 text-sm">
        <input type="checkbox" name="showWind" disabled={disabled} className="size-4" />
        Show wind details
      </label>

      <button
        type="submit"
        disabled={disabled}
        className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        Get widget
      </button>
    </form>
  );
}
