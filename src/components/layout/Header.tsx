"use client";

import Link from "next/link";
import { Container } from "./Container";
import { useEffect, useState } from "react";
import { MovieSearch } from "../domain/MovieSearch";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";
import { usePathname } from "next/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const showBackButton = pathname.startsWith("/movies/");

  // Shortcut: "/" focuses search
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
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    await refreshUser();
    setIsMenuOpen(false);
    router.push("/");
  }

  return (
    <header className='sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur'>
      <Container>
        {/* TOP BAR */}
        <div className='flex h-14 items-center '>
          {/* Left side */}
          <div className='flex items-center gap-4'>
            {showBackButton && (
              <button
                onClick={() => router.back()}
                aria-label='Go back'
                className='rounded-md px-2 py-1 text-3xl text-text-muted hover:bg-text/10 transition'
              >
                ←
              </button>
            )}

            <Link
              href='/'
              className='text-lg font-semibold tracking-tight -mb-1'
            >
              Streamly
            </Link>
          </div>

          {/* Spacer */}
          <div className='flex-1' />

          {/* Right side */}
          <nav className='hidden md:flex items-center gap-4 text-sm text-text'>
            <Link href='/'>Home</Link>

            {!loading && user && <Link href='/profile'>Profile</Link>}

            {!loading &&
              (user ? (
                <>
                  <span className='text-text-muted'>Hi, {user.name}</span>

                  <button
                    onClick={handleLogout}
                    className='text-red-500 hover:underline'
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href='/login'>Login</Link>

                  <Link
                    href='/signup'
                    className='rounded-md bg-primary px-3 py-2 text-white'
                  >
                    Sign up
                  </Link>
                </>
              ))}

            <button
              onClick={toggleTheme}
              className='rounded-md border px-2 py-1'
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
          </nav>

          {/* Mobile button */}
          <button
            className='md:hidden text-2xl'
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label='Toggle menu'
          >
            ☰
          </button>
        </div>

        {/* MOBILE OVERLAY */}
        {isMenuOpen && (
          <div
            className='fixed inset-0 z-40 md:hidden'
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className='md:hidden absolute left-0 right-0 top-14 z-50 bg-background border-b border-white/10 px-4 py-4 flex flex-col gap-4 text-sm'>
            {!loading && user && (
              <Link href='/profile' onClick={() => setIsMenuOpen(false)}>
                Profile
              </Link>
            )}

            {!loading &&
              (user ? (
                <>
                  <span className='text-text-muted'>Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className='text-left text-red-500'
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href='/login' onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link
                    href='/signup'
                    onClick={() => setIsMenuOpen(false)}
                    className='rounded-md bg-primary px-3 py-2 text-white'
                  >
                    Sign up
                  </Link>
                </>
              ))}

            <button
              onClick={toggleTheme}
              className='self-start rounded-md border px-2 py-1'
            >
              {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
        )}

        <MovieSearch />
      </Container>
    </header>
  );
}
