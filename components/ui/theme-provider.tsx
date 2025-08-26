'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'letlapa-ui-theme',
  ...props
}: ThemeProviderProps) {
  // ✅ Never touch localStorage during SSR
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(storageKey) as Theme | null;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    }
    return defaultTheme;
  });

  // Resolve system theme
  const systemPrefersDark = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }, []);

  // Apply class and persist to storage on the client only
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // compute which class to apply
    const effective =
      theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;

    root.classList.remove('light', 'dark');
    root.classList.add(effective);

    // persist selection (not the resolved class) for next visits
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      /* ignore storage issues (e.g., private mode) */
    }
  }, [theme, storageKey]);

  // Keep theme in sync if user changes OS theme while `theme === 'system'`
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (theme !== 'system') return;

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(mql.matches ? 'dark' : 'light');
    };

    mql.addEventListener?.('change', handler);
    return () => mql.removeEventListener?.('change', handler);
  }, [theme]);

  const value: ThemeProviderState = {
    theme,
    // Only set state; persistence happens in the effect above (client-only)
    setTheme: (t: Theme) => setTheme(t),
  };

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
