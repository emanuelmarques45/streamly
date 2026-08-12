"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function TvShowsError({ reset }: { reset: () => void }) {
  return (
    <ErrorState
      title="Não foi possível carregar a série"
      message="O título pode ter sido removido do TMDB ou a API está indisponível."
      onRetry={reset}
    />
  );
}
