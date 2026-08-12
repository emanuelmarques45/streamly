"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = "theme";
const CHANGE_EVENT = "streamly:themechange";

/**
 * A classe `dark` no <html> é a fonte de verdade — o script inline do layout a
 * aplica antes da primeira pintura. Ler o DOM com `useSyncExternalStore` evita
 * o efeito de sincronização (e o flash) que existia antes.
 */
function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  function handleSystemChange(event: MediaQueryListEvent) {
    // Preferência explícita do usuário vence a do sistema.
    if (localStorage.getItem(STORAGE_KEY)) return;

    document.documentElement.classList.toggle("dark", event.matches);
    onStoreChange();
  }

  media.addEventListener("change", handleSystemChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);

  return () => {
    media.removeEventListener("change", handleSystemChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    const next: Theme =
      document.documentElement.classList.contains("dark") ? "light" : "dark";

    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.classList.toggle("dark", next === "dark");
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return ctx;
}
