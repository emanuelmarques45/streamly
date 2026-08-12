"use client";

import Link from "next/link";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MediaSearch } from "../domain/MediaSearch";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { logout } from "@/services/auth";
import { Container } from "./Container";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/discover", label: "Descobrir" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, loading, refreshUser } = useAuth();

  const showBackButton =
    pathname.startsWith("/movies/") || pathname.startsWith("/tvs/");

  // Atalho: "/" foca a busca (ignorado enquanto o usuário digita em um campo).
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key !== "/") return;

      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isTyping) return;

      event.preventDefault();
      document.querySelector<HTMLInputElement>("input#search-bar")?.focus();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  async function handleLogout() {
    await logout();
    await refreshUser();
    setIsMenuOpen(false);
    router.push("/");
  }

  return (
    <header className='sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur'>
      <Container>
        <div className='flex h-14 items-center'>
          <div className='flex items-center gap-2'>
            {showBackButton && (
              <button
                onClick={() => router.back()}
                aria-label='Voltar'
                className='rounded-md px-2 text-2xl text-text-muted transition hover:bg-text/10'
              >
                ←
              </button>
            )}

            <Link href='/' className='text-lg font-semibold tracking-tight'>
              Streamly
            </Link>
          </div>

          <div className='flex-1' />

          <nav className='hidden items-center gap-4 text-sm md:flex'>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={clsx(
                  "transition hover:text-primary",
                  pathname === link.href && "text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}

            {!loading && user && (
              <Link href='/profile' className='transition hover:text-primary'>
                Favoritos
              </Link>
            )}

            {!loading &&
              (user ? (
                <>
                  <span className='text-text-muted'>Olá, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className='text-red-500 hover:underline'
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link href='/login' className='transition hover:text-primary'>
                    Entrar
                  </Link>
                  <Link
                    href='/signup'
                    className='rounded-md bg-primary px-3 py-2 text-white'
                  >
                    Criar conta
                  </Link>
                </>
              ))}

            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </nav>

          <button
            className='text-2xl md:hidden'
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label='Abrir menu'
          >
            ☰
          </button>
        </div>

        {isMenuOpen && (
          <>
            <div
              className='fixed inset-0 z-40 md:hidden'
              onClick={() => setIsMenuOpen(false)}
            />

            <div className='absolute inset-x-0 top-14 z-50 flex flex-col gap-4 border-b border-border bg-background px-4 py-4 text-sm md:hidden'>
              {/* Navegar fecha o menu; o botão de tema, fora deste bloco,
                  mantém o menu aberto. */}
              <div
                className='flex flex-col gap-4'
                onClick={() => setIsMenuOpen(false)}
              >
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}

                {!loading && user && <Link href='/profile'>Favoritos</Link>}

                {!loading &&
                  (user ? (
                    <>
                      <span className='text-text-muted'>Olá, {user.name}</span>
                      <button
                        onClick={handleLogout}
                        className='text-left text-red-500'
                      >
                        Sair
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href='/login'>Entrar</Link>
                      <Link
                        href='/signup'
                        className='rounded-md bg-primary px-3 py-2 text-center text-white'
                      >
                        Criar conta
                      </Link>
                    </>
                  ))}
              </div>

              <ThemeToggle
                theme={theme}
                onToggle={toggleTheme}
                withLabel
                className='self-start'
              />
            </div>
          </>
        )}

        <MediaSearch />
      </Container>
    </header>
  );
}

function ThemeToggle({
  theme,
  onToggle,
  withLabel,
  className,
}: {
  theme: "light" | "dark";
  onToggle: () => void;
  withLabel?: boolean;
  className?: string;
}) {
  const isDark = theme === "dark";

  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      className={clsx(
        "rounded-md border border-border px-2 py-1 transition hover:bg-text/10",
        className
      )}
    >
      <span aria-hidden='true'>{isDark ? "🌙" : "☀️"}</span>
      {withLabel && <span className='ml-2'>{isDark ? "Escuro" : "Claro"}</span>}
    </button>
  );
}
