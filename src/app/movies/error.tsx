"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function MoviesError({ reset }: { reset: () => void }) {
  return (
    <ErrorState
      title="Não foi possível carregar o filme"
      message="O título pode ter sido removido do TMDB ou a API está indisponível."
      onRetry={reset}
    />
  );
}
