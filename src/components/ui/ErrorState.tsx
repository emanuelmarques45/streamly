"use client";

import Link from "next/link";
import { Container } from "../layout/Container";

type ErrorStateProps = {
  title?: string;
  message?: string;
  /** `reset` das error boundaries do App Router. */
  onRetry?: () => void;
};

export function ErrorState({
  title = "Algo deu errado",
  message = "Não conseguimos carregar este conteúdo. Tente novamente em instantes.",
  onRetry,
}: ErrorStateProps) {
  return (
    <Container className='py-20 text-center'>
      <h1 className='mb-2 text-2xl font-semibold'>{title}</h1>
      <p className='mb-8 text-text-muted'>{message}</p>

      <div className='flex items-center justify-center gap-3'>
        {onRetry && (
          <button
            onClick={onRetry}
            className='rounded-lg bg-primary px-4 py-2 text-sm text-white transition hover:opacity-90'
          >
            Tentar de novo
          </button>
        )}

        <Link
          href='/'
          className='rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-text/10'
        >
          Voltar ao início
        </Link>
      </div>
    </Container>
  );
}
