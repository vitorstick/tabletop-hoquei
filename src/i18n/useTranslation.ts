import { create } from 'zustand';
import { Language, LanguageOption, Translations } from './types';
import { en } from './locales/en';
import { pt } from './locales/pt';
import { es } from './locales/es';

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'EN', flag: '🇬🇧', nativeName: 'English' },
  { code: 'pt', label: 'PT', flag: '🇵🇹', nativeName: 'Português' },
  { code: 'es', label: 'ES', flag: '🇪🇸', nativeName: 'Español' },
];

const DICTIONARIES: Record<Language, Translations> = {
  en,
  pt,
  es,
};

const STORAGE_KEY = 'rh_tactics_language';

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved && (saved === 'en' || saved === 'pt' || saved === 'es')) {
      return saved;
    }

    const browserLang = navigator.language?.toLowerCase() || '';
    if (browserLang.startsWith('pt')) return 'pt';
    if (browserLang.startsWith('es')) return 'es';
  } catch {
    // LocalStorage or navigator inaccessible
  }

  return 'en';
}

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: getInitialLanguage(),
  setLanguage: (language: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = language;
      }
    } catch {
      // LocalStorage error
    }
    set({ language });
  },
}));

// Initialize document language on module load
if (typeof document !== 'undefined') {
  document.documentElement.lang = useLanguageStore.getState().language;
}

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const t = DICTIONARIES[language] || DICTIONARIES.en;

  return {
    language,
    setLanguage,
    t,
    languages: AVAILABLE_LANGUAGES,
  };
}
