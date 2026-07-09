import { describe, expect, it } from 'vitest';
import {
  areUnitsValid,
  isLatitudeValid,
  isLongitudeValid,
  isShowWindValid,
  isTitleValid,
  parseShowWind,
} from '../src/validation.js';

describe('validation', () => {
  it('validates widget titles', () => {
    expect(isTitleValid('Hello Widget')).toBe(true);
    expect(isTitleValid('')).toBe(false);
    expect(isTitleValid(null)).toBe(false);
    expect(isTitleValid('bad@title')).toBe(false);
  });

  it('validates units', () => {
    expect(areUnitsValid('metric')).toBe(true);
    expect(areUnitsValid('imperial')).toBe(true);
    expect(areUnitsValid('kelvin')).toBe(false);
  });

  it('validates showWind values', () => {
    expect(isShowWindValid(true)).toBe(true);
    expect(isShowWindValid('false')).toBe(true);
    expect(parseShowWind('true')).toBe(true);
    expect(parseShowWind('false')).toBe(false);
    expect(isShowWindValid(null)).toBe(false);
  });

  it('validates coordinates', () => {
    expect(isLatitudeValid(-33.87)).toBe(true);
    expect(isLatitudeValid(120)).toBe(false);
    expect(isLongitudeValid(151.21)).toBe(true);
    expect(isLongitudeValid(-200)).toBe(false);
  });
});
