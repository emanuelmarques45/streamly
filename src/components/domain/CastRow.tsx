"use client";

import Image from "next/image";
import { IMAGE_BASE_URL } from "@/constants";
import { CastMember } from "@/types/Credits";
import { MediaScroller } from "./MediaScroller";

type CastRowProps = {
  cast: CastMember[];
  limit?: number;
};

export function CastRow({ cast, limit = 20 }: CastRowProps) {
  const members = cast.slice(0, limit);

  if (!members.length) return null;

  return (
    <section>
      <h2 className='mb-4 text-xl font-semibold'>Elenco principal</h2>

      <MediaScroller label='Elenco principal'>
        {members.map((person) => (
          <figure key={person.id} className='w-28 shrink-0'>
            <div className='relative aspect-2/3 overflow-hidden rounded-lg bg-border'>
              {person.profile_path ? (
                <Image
                  src={`${IMAGE_BASE_URL.w185}${person.profile_path}`}
                  alt={person.name}
                  fill
                  sizes='112px'
                  className='object-cover'
                />
              ) : (
                <div className='flex h-full items-center justify-center text-2xl text-text-muted'>
                  <span aria-hidden='true'>👤</span>
                </div>
              )}
            </div>

            <figcaption className='mt-2'>
              <p className='line-clamp-2 text-sm font-medium'>{person.name}</p>
              {person.character && (
                <p className='line-clamp-2 text-xs text-text-muted'>
                  {person.character}
                </p>
              )}
            </figcaption>
          </figure>
        ))}
      </MediaScroller>
    </section>
  );
}
