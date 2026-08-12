import Image from "next/image";
import { IMAGE_BASE_URL } from "@/constants";
import { CastMember } from "@/types/Credits";
import { toFavoriteType } from "@/types/Favorite";
import { Genre } from "@/types/Genre";
import { MediaItem, MediaType } from "@/types/Media";
import { Video } from "@/types/Video";
import { formatDate, formatRating } from "@/utils/format";
import { Container } from "../layout/Container";
import { RatingBadge } from "../ui/RatingBadge";
import { CastRow } from "./CastRow";
import { FavoriteButton } from "./FavoriteButton";
import { ItemPoster } from "./ItemPoster";
import { MediaCarousel } from "./MediaCarousel";
import { TrailerDialog } from "./TrailerDialog";

type MediaDetailProps = {
  id: number;
  mediaType: MediaType;
  title: string;
  tagline?: string | null;
  overview?: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  voteCount?: number;
  date?: string | null;
  dateLabel: string;
  genres?: Genre[];
  /** Short metadata shown in the facts line (runtime, seasons, and so on). */
  facts?: (string | null)[];
  homepage?: string | null;
  trailer?: Video | null;
  cast?: CastMember[];
  recommendations?: MediaItem[];
  children?: React.ReactNode;
};

/**
 * Shared layout for the movie and TV show pages, which used to repeat almost
 * the same JSX.
 */
export function MediaDetail({
  id,
  mediaType,
  title,
  tagline,
  overview,
  posterPath,
  backdropPath,
  voteAverage,
  voteCount,
  date,
  dateLabel,
  genres,
  facts = [],
  homepage,
  trailer,
  cast,
  recommendations,
  children,
}: MediaDetailProps) {
  const releaseDate = formatDate(date);
  const visibleFacts = facts.filter(Boolean) as string[];

  return (
    <article>
      {backdropPath && (
        <div className='relative -mt-4 mb-6 h-48 w-full overflow-hidden sm:h-64 md:h-80'>
          <Image
            src={`${IMAGE_BASE_URL.w1280}${backdropPath}`}
            alt=''
            fill
            priority
            sizes='100vw'
            className='object-cover'
          />
          {/* Gradient so the text stays legible over the image. */}
          <div className='absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/20' />
        </div>
      )}

      <Container className={backdropPath ? "-mt-24 md:-mt-32" : undefined}>
        <div className='flex flex-col gap-6 md:flex-row'>
          <div className='w-full max-w-3xs shrink-0 sm:max-w-xs'>
            {posterPath ? (
              <ItemPoster
                src={`${IMAGE_BASE_URL.w500}${posterPath}`}
                alt={title}
              />
            ) : (
              <div className='flex aspect-2/3 w-full items-center justify-center rounded-xl bg-surface text-sm text-text-muted'>
                Sem imagem
              </div>
            )}
          </div>

          <div className='flex flex-1 flex-col gap-4'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <h1 className='text-2xl font-semibold md:text-4xl'>{title}</h1>
                {tagline && (
                  <p className='mt-1 text-sm italic text-text-muted'>
                    {tagline}
                  </p>
                )}
              </div>

              <FavoriteButton
                itemId={id}
                itemType={toFavoriteType(mediaType)}
                className='shrink-0'
              />
            </div>

            <div className='flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-text-muted'>
              <RatingBadge value={voteAverage} />

              {formatRating(voteAverage) && voteCount ? (
                <span>({voteCount.toLocaleString("pt-BR")} votos)</span>
              ) : null}

              {releaseDate && (
                <span>
                  · {dateLabel}: {releaseDate}
                </span>
              )}

              {visibleFacts.map((fact) => (
                <span key={fact}>· {fact}</span>
              ))}
            </div>

            {genres && genres.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {genres.map((genre) => (
                  <span
                    key={genre.id}
                    className='rounded-full bg-border px-3 py-1 text-xs font-medium'
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className='text-sm leading-relaxed text-text/80'>
              {overview || "Sinopse ainda não disponível para este título."}
            </p>

            <div className='flex flex-wrap items-center gap-3'>
              {trailer && <TrailerDialog trailer={trailer} title={title} />}

              {homepage && (
                <a
                  href={homepage}
                  target='_blank'
                  rel='noreferrer noopener'
                  className='rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-text/10'
                >
                  Site oficial ↗
                </a>
              )}
            </div>
          </div>
        </div>

        <div className='mt-12 space-y-12'>
          {cast && cast.length > 0 && <CastRow cast={cast} />}

          {children}

          {recommendations && recommendations.length > 0 && (
            <MediaCarousel title='Você também pode gostar' items={recommendations} />
          )}
        </div>
      </Container>
    </article>
  );
}
