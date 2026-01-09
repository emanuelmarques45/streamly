"use client";

import { useEffect, useState } from "react";
import { getFavorites } from "@/services/favorites";
import { getMoviesByIds } from "@/services/movies";
import { MovieRow } from "@/components/domain/MovieRow";
import { Container } from "@/components/layout/Container";
import { Movie } from "@/types/Movie";

export default function ProfilePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const favRes = await getFavorites();
      if (!favRes.ok) return;

      const movies = await getMoviesByIds(favRes.data);
      setMovies(movies);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return <Container>Loading favorites...</Container>;
  }

  if (!movies.length) {
    return (
      <Container>
        <p>No favorites yet.</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className='text-xl font-semibold mb-6'>Your favorites</h1>
      <MovieRow movies={movies} />
    </Container>
  );
}
