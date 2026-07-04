import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT ?? 9090),
  publicUrl: process.env.PUBLIC_URL ?? `http://localhost:${process.env.PORT ?? 9090}`,
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY ?? '',
};
