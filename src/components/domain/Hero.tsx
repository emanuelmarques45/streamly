import Image from "next/image";
import Link from "next/link";
import { IMAGE_BASE_URL } from "@/constants";
import { toFavoriteType } from "@/types/Favorite";
import { MediaItem, mediaHref } from "@/types/Media";
import { formatYear } from "@/utils/format";
import { Container } from "../layout/Container";
import { RatingBadge } from "../ui/RatingBadge";
import { FavoriteButton } from "./FavoriteButton";

/** Destaque do topo da home, com o título mais popular da semana. */
export function Hero({ item }: { item: MediaItem }) {
  const year = formatYear(item.date);

  return (
    <section className='relative -mt-4 mb-10 overflow-hidden'>
      <div className='relative h-[60vh] min-h-96 w-full'>
        {item.backdropPath ? (
          <Image
            src={`${IMAGE_BASE_URL.original}${item.backdropPath}`}
            alt=''
            fill
            priority
            sizes='100vw'
            className='object-cover object-top'
          />
        ) : (
          <div className='h-full w-full bg-surface' />
        )}

        <div className='absolute inset-0 bg-linear-to-t from-background via-background/80 to-background/20' />
      </div>

      <Container className='absolute inset-x-0 bottom-0 pb-10'>
        <div className='max-w-2xl space-y-4'>
          <span className='inline-block rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white'>
            Em alta esta semana
          </span>

          <h1 className='text-3xl font-bold drop-shadow-lg md:text-5xl'>
            {item.title}
          </h1>

          <div className='flex flex-wrap items-center gap-3 text-sm text-text-muted'>
            <RatingBadge value={item.voteAverage} />
            {year && <span>· {year}</span>}
            <span>· {item.mediaType === "movie" ? "Filme" : "Série"}</span>
          </div>

          <p className='line-clamp-3 text-sm text-text/80 md:text-base'>
            {item.overview}
          </p>

          <div className='flex items-center gap-3'>
            <Link
              href={mediaHref(item)}
              className='rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90'
            >
              Ver detalhes
            </Link>

            <Link
              href='/discover'
              className='rounded-lg border border-border bg-background/60 px-5 py-2.5 text-sm transition hover:bg-text/10'
            >
              Descobrir mais
            </Link>

            <FavoriteButton
              itemId={item.id}
              itemType={toFavoriteType(item.mediaType)}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
