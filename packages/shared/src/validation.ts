import type { Units } from './types.js';

const TITLE_PATTERN = /^[A-Za-z0-9,\s]+$/;

export function isTitleValid(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && TITLE_PATTERN.test(value);
}

export function areUnitsValid(value: unknown): value is Units {
  return value === 'metric' || value === 'imperial';
}

export function isShowWindValid(value: unknown): value is boolean | 'true' | 'false' {
  if (typeof value === 'boolean') {
    return true;
  }

  if (typeof value === 'string') {
    const normalized = value.toLowerCase();
    return normalized === 'true' || normalized === 'false';
  }

  return false;
}

export function parseShowWind(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }

  return false;
}

export function isLatitudeValid(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= -90 && value <= 90;
}

export function isLongitudeValid(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= -180 && value <= 180;
}
