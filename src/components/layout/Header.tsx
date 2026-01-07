"use client";

import Link from "next/link";
import { Container } from "./Container";
import { useEffect } from "react";
import { useTheme } from "@/context/themeContext";
import { MovieSearch } from "../domain/MovieSearch";

export function Header() {
  // Atalho: pressionar "/" foca na busca
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "/") {
        const input =
          document.querySelector<HTMLInputElement>("input#search-bar");
        input?.focus();
        event.preventDefault();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const { theme, toggleTheme } = useTheme();

  return (
    <header className='sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur'>
      <Container>
        <div className='flex h-14 items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='text-lg font-semibold tracking-tight'>
            Movie Hub
          </Link>

          {/* Navegação */}
          <nav className='flex items-center gap-4 text-sm text-text'>
            {/* <Link href='/' className='hover:text-white transition'>
              Home
            </Link> */}

            <span className='hidden md:inline text-xs text-gray-500'>
              Press <kbd className='rounded bg-white/10 px-1'>/</kbd> to search
            </span>

            <button
              onClick={toggleTheme}
              aria-label='Toggle theme'
              className='rounded-md border border-black/10 dark:border-white/10 px-2 py-1 text-sm transition hover:bg-black/5 dark:hover:bg-white/10'
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
          </nav>
        </div>
        <MovieSearch />
      </Container>
    </header>
  );
}
