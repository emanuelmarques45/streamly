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

      {/* <Pagination currentPage={data.page} totalPages={data.total_pages} /> */}
    </Container>
  );
}
