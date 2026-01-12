import { Container } from "./Container";

export function Footer() {
  return (
    <footer className='border-t border-white/10 mt-12'>
      <Container>
        <div className='py-6 text-center text-sm text-gray-400'>
          © {new Date().getFullYear()} Streamly
        </div>
      </Container>
    </footer>
  );
}
