"use client";

import { KeyboardEvent, useEffect, useState, useRef } from "react";
import { Movie } from "@/types/Movie";
import Link from "next/link";
import Image from "next/image";
import { IMAGE_BASE_URL } from "@/constants";
import { useRouter } from "next/navigation";

export function MovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query) {
      setMovies([]);
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    const timeout = setTimeout(async () => {
      setIsLoading(true);
      const result = await fetch(`/api/movies/search?q=${query}`);
      setMovies((await result.json()) as Movie[]);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!movies.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < movies.length - 1 ? prev + 1 : 0));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : movies.length - 1));
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      router.push(`/movies/${movies[activeIndex].id}`);
      setIsVisible(false);
      setActiveIndex(-1);
    }

    if (e.key === "Escape") {
      setIsVisible(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setIsVisible(false);
          setActiveIndex(-1);
        }
      }}
    >
      <input
        className='
          h-10
          w-full
          bg-transparent
          px-1
          text-sm
          outline-none
          border-b
          border-text/20
          transition
          focus:border-primary
          focus:border-b-2
        '
        placeholder='Search movies...'
        value={query}
        id='search-bar'
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsVisible(true)}
        aria-autocomplete='list'
        aria-expanded={isVisible}
        aria-activedescendant={
          activeIndex >= 0 ? `movie-option-${activeIndex}` : undefined
        }
      />

      {isVisible && (
        <ul className='mt-4 max-h-[75vh] overflow-y-auto' role='listbox'>
          {movies.map((movie, index) => (
            <li
              key={movie.id}
              id={`movie-option-${index}`}
              role='option'
              aria-selected={index === activeIndex}
            >
              <Link
                href={`/movies/${movie.id}`}
                className={`flex items-center gap-4 py-4 border-b border-text/20 px-3 ${
                  index === activeIndex ? "bg-primary/20" : "hover:bg-text/10"
                }`}
                onClick={() => {
                  setIsVisible(false);
                  setActiveIndex(-1);
                }}
              >
                <Image
                  src={`${IMAGE_BASE_URL.w342}${movie.poster_path}`}
                  alt={movie.title}
                  width={48}
                  height={48}
                  className='object-cover'
                />
                <div className='flex-1 min-w-0'>
                  <span>{movie.title}</span>
                  <p className='truncate text-sm'>{movie.overview}</p>
                </div>
              </Link>
            </li>
          ))}

          {movies.length === 0 && query && !isLoading && (
            <li className='px-3 py-4 text-sm text-text-muted'>
              No results found.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
