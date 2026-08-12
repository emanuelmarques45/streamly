import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className='mt-12 border-t border-border'>
      <Container>
        <div className='flex flex-col items-center gap-3 py-8 text-center text-sm text-text-muted sm:flex-row sm:justify-between sm:text-left'>
          <p>© {new Date().getFullYear()} Streamly</p>

          <nav className='flex items-center gap-4'>
            <Link href='/' className='hover:text-text'>
              Início
            </Link>
            <Link href='/discover' className='hover:text-text'>
              Descobrir
            </Link>
          </nav>

          {/* Attribution required by the TMDB API terms of use. */}
          <p className='max-w-sm text-xs'>
            Este produto usa a API do{" "}
            <a
              href='https://www.themoviedb.org'
              target='_blank'
              rel='noreferrer noopener'
              className='underline hover:text-text'
            >
              TMDB
            </a>
            , mas não é endossado nem certificado por ele.
          </p>
        </div>
      </Container>
    </footer>
  );
}
