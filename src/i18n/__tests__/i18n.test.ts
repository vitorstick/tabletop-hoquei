import { describe, it, expect, beforeEach, vi } from 'vitest';
import { en } from '../locales/en';
import { pt } from '../locales/pt';
import { es } from '../locales/es';
import { useLanguageStore, AVAILABLE_LANGUAGES } from '../useTranslation';

describe('i18n translations', () => {
  function getKeys(obj: Record<string, unknown>, prefix = ''): string[] {
    let keys: string[] = [];
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        keys = keys.concat(getKeys(val as Record<string, unknown>, fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    return keys;
  }

  it('has identical keys across EN, PT, and ES dictionaries', () => {
    const enKeys = getKeys(en as unknown as Record<string, unknown>).sort();
    const ptKeys = getKeys(pt as unknown as Record<string, unknown>).sort();
    const esKeys = getKeys(es as unknown as Record<string, unknown>).sort();

    expect(ptKeys).toEqual(enKeys);
    expect(esKeys).toEqual(enKeys);
  });

  it('has no empty string values in any translation dictionary', () => {
    const validateNotEmpty = (obj: Record<string, unknown>, lang: string) => {
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'string') {
          expect(v.trim().length, `Empty string at ${lang}.${k}`).toBeGreaterThan(0);
        } else if (v && typeof v === 'object') {
          validateNotEmpty(v as Record<string, unknown>, `${lang}.${k}`);
        }
      }
    };

    validateNotEmpty(en as unknown as Record<string, unknown>, 'en');
    validateNotEmpty(pt as unknown as Record<string, unknown>, 'pt');
    validateNotEmpty(es as unknown as Record<string, unknown>, 'es');
  });

  it('lists EN, PT, and ES in AVAILABLE_LANGUAGES', () => {
    const codes = AVAILABLE_LANGUAGES.map((l) => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('pt');
    expect(codes).toContain('es');
    expect(codes.length).toBe(3);
  });
});

describe('useLanguageStore', () => {
  const mockStorage: Record<string, string> = {};

  beforeEach(() => {
    globalThis.localStorage = {
      getItem: vi.fn((key: string) => mockStorage[key] ?? null),
      setItem: vi.fn((key: string, val: string) => {
        mockStorage[key] = val;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key];
      }),
      clear: vi.fn(() => {
        for (const k of Object.keys(mockStorage)) delete mockStorage[k];
      }),
      length: 0,
      key: vi.fn(() => null),
    } as unknown as Storage;

    useLanguageStore.getState().setLanguage('en');
  });

  it('changes language and persists to localStorage', () => {
    expect(useLanguageStore.getState().language).toBe('en');

    useLanguageStore.getState().setLanguage('pt');
    expect(useLanguageStore.getState().language).toBe('pt');
    expect(globalThis.localStorage.getItem('rh_tactics_language')).toBe('pt');

    useLanguageStore.getState().setLanguage('es');
    expect(useLanguageStore.getState().language).toBe('es');
    expect(globalThis.localStorage.getItem('rh_tactics_language')).toBe('es');
  });
});
