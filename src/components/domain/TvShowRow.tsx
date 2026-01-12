import { getTvShows } from "@/services/tv";
import { TvShowCard } from "./TvShowCard";
import { TvShowCategory } from "@/types/TvShow";

type TvShowRowProps = {
  title: string;
  category: TvShowCategory;
};

export async function TvShowRow({ title, category }: TvShowRowProps) {
  const { results } = await getTvShows(1, category);

  return (
    <section className='pb-10'>
      <h2 className='mb-4 text-2xl md:text-3xl font-bold'>{title}</h2>
      <div
        className='flex
        gap-4
        overflow-x-auto
        pb-2
        scrollbar-hide
        scroll-smooth'
      >
        {results.map((show) => (
          <TvShowCard key={show.id} show={show} />
        ))}
      </div>
    </section>
  );
}
