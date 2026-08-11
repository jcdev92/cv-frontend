import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ThemeContext, type ThemeMode } from './themeContext';

const STORAGE_KEY = 'cv-theme';

function systemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialTheme(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' || stored === 'system' || stored === 'hacker' ? stored : 'system';
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === 'hacker') {
    root.dataset.theme = 'hacker';
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
    return;
  }
  const effective = mode === 'system' ? systemTheme() : mode;
  root.dataset.theme = effective;
  root.classList.toggle('dark', effective === 'dark');
  root.style.colorScheme = effective;
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme]);

  const setTheme = useCallback((next: ThemeMode) => {
    localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
  }, []);

  const cycleTheme = useCallback(() => {
    const order: ThemeMode[] = ['light', 'dark', 'system', 'hacker'];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};