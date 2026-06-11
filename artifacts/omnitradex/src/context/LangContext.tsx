import { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, getLocale, type LangCode, type T } from '../i18n/translations';

export type { LangCode } from '../i18n/translations';

interface LangContextType {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: T;
  fmtNum: (n: number) => string;
}

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangCode>('en');
  const t = translations[lang];

  function fmtNum(n: number): string {
    return new Intl.NumberFormat(getLocale(lang)).format(n);
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t, fmtNum }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextType {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}
