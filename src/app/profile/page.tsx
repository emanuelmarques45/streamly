import type { Metadata } from "next";
import Link from "next/link";
import { FavoriteRow } from "@/components/domain/FavoriteRow";
import { Container } from "@/components/layout/Container";
import { getFavorites } from "@/services/favorites";
import { getMoviesByIds } from "@/services/movies";
import { getTvShowsByIds } from "@/services/tv";
import { FavoriteType } from "@/types/Favorite";
import { toMediaItem } from "@/types/Media";

export const metadata: Metadata = {
  title: "Meus favoritos",
};

// Favoritos são por usuário: nunca devem ser servidos do cache estático.
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const result = await getFavorites();

  if (!result.ok) {
    return (
      <Container className='py-16 text-center'>
        <h1 className='mb-2 text-2xl font-semibold'>Acesso restrito</h1>
        <p className='mb-6 text-text-muted'>
          Entre na sua conta para ver seus favoritos.
        </p>
        <Link
          href='/login?redirect=/profile'
          className='rounded-lg bg-primary px-4 py-2 text-white'
        >
          Fazer login
        </Link>
      </Container>
    );
  }

  const favorites = result.data;

  const movieIds = favorites
    .filter((favorite) => favorite.itemType === FavoriteType.MOVIE)
    .map((favorite) => favorite.itemId);

  const tvIds = favorites
    .filter((favorite) => favorite.itemType === FavoriteType.TV)
    .map((favorite) => favorite.itemId);

  const [movies, tvShows] = await Promise.all([
    movieIds.length ? getMoviesByIds(movieIds) : [],
    tvIds.length ? getTvShowsByIds(tvIds) : [],
  ]);

  if (!movies.length && !tvShows.length) {
    return (
      <Container className='py-16 text-center'>
        <h1 className='mb-2 text-2xl font-semibold'>
          Sua lista está vazia
        </h1>
        <p className='mb-6 text-text-muted'>
          Toque no coração de qualquer título para salvá-lo aqui.
        </p>
        <Link
          href='/discover'
          className='rounded-lg bg-primary px-4 py-2 text-white'
        >
          Descobrir títulos
        </Link>
      </Container>
    );
  }

  return (
    <Container className='space-y-10 py-6'>
      <header>
        <h1 className='text-3xl font-bold'>Meus favoritos</h1>
        <p className='mt-1 text-text-muted'>
          {movies.length + tvShows.length} título(s) salvos
        </p>
      </header>

      <FavoriteRow title='Filmes' items={movies.map(toMediaItem)} />
      <FavoriteRow title='Séries' items={tvShows.map(toMediaItem)} />
    </Container>
  );
}
