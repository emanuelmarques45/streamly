import { MovieRow } from "@/components/domain/MovieRow";
import { Container } from "@/components/layout/Container";
import { TvShowRow } from "@/components/domain/TvShowRow";

export default function HomePage() {
  return (
    <Container>
      <MovieRow title='Populares' category='popular' />
      <MovieRow title='Top Avaliados' category='top_rated' />
      <MovieRow title='Em Cartaz' category='now_playing' />
      <MovieRow title='Em Breve' category='upcoming' />

      <TvShowRow title='Séries Populares' category='popular' />
      <TvShowRow title='Mais Bem Avaliadas' category='top_rated' />
      <TvShowRow title='No Ar' category='on_the_air' />
      <TvShowRow title='Hoje' category='airing_today' />

      {/* <Pagination currentPage={data.page} totalPages={data.total_pages} /> */}
    </Container>
  );
}
