import { getMovies } from "@/services/movies";
import { MovieGrid } from "@/components/domain/MovieGrid";
import { Container } from "@/components/layout/Container";
import { Pagination } from "@/components/domain/Pagination";

type HomePageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const data = await getMovies(page);

  return (
    <Container>
      <MovieGrid movies={data.results} />

      <Pagination currentPage={data.page} totalPages={data.total_pages} />
    </Container>
  );
}
