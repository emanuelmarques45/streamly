import type { Metadata } from "next";
import { DiscoverFilters } from "@/components/domain/DiscoverFilters";
import { DiscoverResults } from "@/components/domain/DiscoverResults";
import { Container } from "@/components/layout/Container";
import { getGenres, isDiscoverSort, type DiscoverSort } from "@/services/catalog";
import { MediaType } from "@/types/Media";
import { parseIdList, parseYear } from "@/utils/params";

export const metadata: Metadata = {
  title: "Descobrir",
  description:
    "Filtre filmes e séries por gênero, ano e ordenação para encontrar seu próximo título.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const mediaType: MediaType = first(params.type) === "tv" ? "tv" : "movie";
  const selectedGenres = parseIdList(first(params.genres));
  const year = parseYear(first(params.year));

  const sortParam = first(params.sort) ?? "";
  const sort: DiscoverSort = isDiscoverSort(sortParam)
    ? sortParam
    : "popularity.desc";

  const genres = await getGenres(mediaType);

  return (
    <Container className='space-y-8 py-6'>
      <header>
        <h1 className='text-3xl font-bold md:text-4xl'>Descobrir</h1>
        <p className='mt-2 text-text-muted'>
          Combine gênero, ano e ordenação para achar o que assistir.
        </p>
      </header>

      <DiscoverFilters
        mediaType={mediaType}
        genres={genres}
        selectedGenres={selectedGenres}
        year={year}
        sort={sort}
      />

      <DiscoverResults
        // Changing a filter mounts a fresh tree, resetting the infinite scroll.
        key={`${mediaType}-${selectedGenres.join(",")}-${year ?? ""}-${sort}`}
        mediaType={mediaType}
        genres={selectedGenres}
        year={year}
        sort={sort}
      />
    </Container>
  );
}
