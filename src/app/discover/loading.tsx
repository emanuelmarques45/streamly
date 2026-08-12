import { CardSkeleton } from "@/components/domain/CardSkeleton";
import { Container } from "@/components/layout/Container";

export default function LoadingDiscover() {
  return (
    <Container className='space-y-8 py-6'>
      <div className='h-10 w-48 animate-pulse rounded bg-border' />

      <div className='flex flex-wrap gap-2'>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className='h-8 w-24 animate-pulse rounded-full bg-border'
          />
        ))}
      </div>

      <div className='flex flex-wrap justify-center gap-6 sm:justify-normal'>
        {Array.from({ length: 12 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </Container>
  );
}
