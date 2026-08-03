import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type ThemeMode } from '../theme/themeContext';

const icons: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const labels: Record<ThemeMode, string> = {
  light: 'Tema claro',
  dark: 'Tema oscuro',
  system: 'Tema del sistema',
};

export const ThemeToggle = () => {
  const { theme, cycleTheme } = useTheme();
  const Icon = icons[theme];

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title={`${labels[theme]} (clic para cambiar)`}
      aria-label={`Cambiar tema (${labels[theme]})`}
      className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-500/10 transition"
    >
      <Icon className="h-5 w-5" />
    </button>
  );
};
