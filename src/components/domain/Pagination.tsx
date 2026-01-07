"use client";

import { useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className='mt-8 flex items-center justify-center gap-4'>
      <button
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        className='rounded-md border border-border px-3 py-1 disabled:opacity-40'
      >
        ← Anterior
      </button>

      <span className='text-sm text-text-muted'>
        Página {currentPage} de {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className='rounded-md border border-border px-3 py-1 disabled:opacity-40'
      >
        Próxima →
      </button>
    </div>
  );
}
