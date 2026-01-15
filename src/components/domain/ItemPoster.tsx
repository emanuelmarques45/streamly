"use client";

import Image from "next/image";
import { useState } from "react";

export function ItemPoster({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className='relative aspect-2/3 w-full max-w-xs overflow-hidden rounded-xl bg-border'>
      {!loaded && <div className='absolute inset-0 animate-pulse bg-border' />}

      <Image
        src={src}
        alt={alt}
        fill
        priority
        onLoad={() => setLoaded(true)}
        className={`
          object-cover
          transition-opacity
          duration-300
          ${loaded ? "opacity-100" : "opacity-0"}
        `}
        sizes='(max-width: 768px) 100vw, 320px'
      />
    </div>
  );
}
