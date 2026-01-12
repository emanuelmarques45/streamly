"use client";

import { useEffect, useState } from "react";
import { getFavorites } from "@/services/favorites";
import { getMoviesByIds } from "@/services/movies";
import { Container } from "@/components/layout/Container";
import { Movie } from "@/types/Movie";
import { FavoriteRow } from "@/components/domain/FavoriteRow";

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
      <FavoriteRow title='Your favorites' movies={movies} />
    </Container>
  );
}
