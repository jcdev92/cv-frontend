import { useState, useCallback, type ReactNode } from 'react';
import { LanguageContext, getInitialLang, type Lang, translations } from './languageContext';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((next: Lang) => {
    localStorage.setItem('cv-lang', next);
    setLangState(next);
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === 'es' ? 'en' : 'es');
  }, [lang, setLang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};
