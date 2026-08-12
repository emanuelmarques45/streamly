export type Video = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
};

export type Videos = {
  results: Video[];
};

/**
 * Picks the best video to show: official YouTube trailers first, then any
 * trailer, then teasers, and finally any YouTube video.
 */
export function pickTrailer(videos?: Video[]): Video | null {
  if (!videos?.length) return null;

  const youtube = videos.filter((v) => v.site === "YouTube");
  if (!youtube.length) return null;

  return (
    youtube.find((v) => v.type === "Trailer" && v.official) ??
    youtube.find((v) => v.type === "Trailer") ??
    youtube.find((v) => v.type === "Teaser") ??
    youtube[0]
  );
}
