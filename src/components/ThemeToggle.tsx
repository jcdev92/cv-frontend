import { Sun, Moon, Monitor, Terminal } from 'lucide-react';
import { useTheme, type ThemeMode } from '../theme/themeContext';

const icons: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
  hacker: Terminal,
};

const labels: Record<ThemeMode, string> = {
  light: 'Tema claro',
  dark: 'Tema oscuro',
  system: 'Tema del sistema',
  hacker: 'Tema hacker',
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
      className="p-2 rounded-md text-muted hover:text-accent hover:bg-accent-soft transition"
    >
      <Icon className="h-5 w-5" />
    </button>
  );
};