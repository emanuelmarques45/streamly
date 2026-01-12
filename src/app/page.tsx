import { MovieRow } from "@/components/domain/MovieRow";
import { Container } from "@/components/layout/Container";
import { TvShowRow } from "@/components/domain/TvShowRow";

export default function HomePage() {
  return (
    <Container>
      <MovieRow title='Popular Movies' category='popular' />
      <MovieRow title='Top Rated Movies' category='top_rated' />
      <MovieRow title='Now Playing' category='now_playing' />
      <MovieRow title='Upcoming Movies' category='upcoming' />

      <TvShowRow title='Popular TV Shows' category='popular' />
      <TvShowRow title='Top Rated TV Shows' category='top_rated' />
      <TvShowRow title='On The Air' category='on_the_air' />
      <TvShowRow title='Airing Today' category='airing_today' />

      {/* <Pagination currentPage={data.page} totalPages={data.total_pages} /> */}
    </Container>
  );
}
