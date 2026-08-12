import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <Container className='py-24 text-center'>
      <p className='text-6xl font-bold text-primary'>404</p>
      <h1 className='mt-4 text-2xl font-semibold'>Página não encontrada</h1>
      <p className='mt-2 text-text-muted'>
        O título que você procura não existe ou saiu do catálogo.
      </p>

      <div className='mt-8 flex items-center justify-center gap-3'>
        <Link
          href='/'
          className='rounded-lg bg-primary px-4 py-2 text-sm text-white'
        >
          Voltar ao início
        </Link>
        <Link
          href='/discover'
          className='rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-text/10'
        >
          Descobrir títulos
        </Link>
      </div>
    </Container>
  );
}
