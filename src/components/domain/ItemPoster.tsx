"use client";

import Image from "next/image";
import { useState } from "react";

type ItemPosterProps = {
  src: string;
  alt: string;
  sizes?: string;
};

export function ItemPoster({
  src,
  alt,
  sizes = "(max-width: 768px) 60vw, 320px",
}: ItemPosterProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className='relative aspect-2/3 w-full overflow-hidden rounded-xl bg-border shadow-lg'>
      {!loaded && <div className='absolute inset-0 animate-pulse bg-border' />}

      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        className={`object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
