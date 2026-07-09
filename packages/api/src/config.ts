import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
dotenv.config({ path: path.join(repoRoot, '.env') });

export const config = {
  port: Number(process.env.PORT ?? 9090),
  publicUrl: process.env.PUBLIC_URL ?? `http://localhost:${process.env.PORT ?? 9090}`,
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY ?? '',
};
