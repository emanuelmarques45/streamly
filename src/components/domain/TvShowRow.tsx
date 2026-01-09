import { getTvShows } from "@/services/tv";
import { TvShowCategory } from "@/types/TvShowCategory";
import { TvShowCard } from "./TvShowCard";

type TvShowRowProps = {
  title: string;
  category: TvShowCategory;
};

export async function TvShowRow({ title, category }: TvShowRowProps) {
  const { results } = await getTvShows(1, category);

  return (
    <section className='pb-10'>
      <h2 className='mb-4 text-xl font-semibold'>{title}</h2>
      <div
        className='flex
        gap-4
        overflow-x-auto
        pb-2
        scrollbar-hide'
      >
        {results.map((show) => (
          <TvShowCard key={show.id} show={show} />
        ))}
      </div>
    </section>
  );
}
