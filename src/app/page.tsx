import { Hero } from "@/components/domain/Hero";
import { MediaCarousel } from "@/components/domain/MediaCarousel";
import { MediaRow } from "@/components/domain/MediaRow";
import { Container } from "@/components/layout/Container";
import { getTrending } from "@/services/catalog";
import { MediaItem } from "@/types/Media";

export default async function HomePage() {
  // O destaque é opcional: se o TMDB falhar, a home continua útil com as linhas.
  let trending: MediaItem[] = [];
  try {
    trending = await getTrending("all", "week");
  } catch {
    trending = [];
  }

  const hero = trending.find((item) => item.backdropPath) ?? trending[0];
  const rest = trending.filter((item) => item.id !== hero?.id);

  return (
    <>
      {hero && <Hero item={hero} />}

      <Container>
        {rest.length > 0 && (
          <MediaCarousel title='Em alta esta semana' items={rest} />
        )}

        <MediaRow
          title='Filmes populares'
          mediaType='movie'
          category='popular'
          href='/discover?type=movie'
          priority={!hero}
        />
        <MediaRow
          title='Séries populares'
          mediaType='tv'
          category='popular'
          href='/discover?type=tv'
        />
        <MediaRow
          title='Filmes mais bem avaliados'
          mediaType='movie'
          category='top_rated'
          href='/discover?type=movie&sort=vote_average.desc'
        />
        <MediaRow
          title='Em cartaz'
          mediaType='movie'
          category='now_playing'
        />
        <MediaRow title='Em breve' mediaType='movie' category='upcoming' />
        <MediaRow
          title='Séries mais bem avaliadas'
          mediaType='tv'
          category='top_rated'
          href='/discover?type=tv&sort=vote_average.desc'
        />
        <MediaRow title='No ar' mediaType='tv' category='on_the_air' />
        <MediaRow
          title='Exibindo hoje'
          mediaType='tv'
          category='airing_today'
        />
      </Container>
    </>
  );
}
