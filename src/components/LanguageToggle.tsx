import { Languages } from 'lucide-react';
import { useLanguage } from '../i18n/languageContext';

export const LanguageToggle = () => {
  const { lang, toggle } = useLanguage();
  const next = lang === 'es' ? 'EN' : 'ES';

  return (
    <button
      type="button"
      onClick={toggle}
      title={lang === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}
      aria-label={lang === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}
      className="flex items-center gap-1 p-2 rounded-md text-muted hover:text-accent hover:bg-accent-soft transition text-xs font-bold tracking-wide"
    >
      <Languages className="h-5 w-5" />
      <span>{next}</span>
    </button>
  );
};

export default LanguageToggle;