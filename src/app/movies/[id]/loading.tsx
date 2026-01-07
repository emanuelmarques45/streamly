export default function LoadingMovie() {
  return (
    <section className='mx-auto max-w-5xl px-4 py-6 md:py-10'>
      <div className='flex flex-col gap-6 md:flex-row animate-pulse'>
        {/* Poster */}
        <div className='aspect-2/3 w-full max-w-xs rounded-xl bg-white/10' />

        {/* Conteúdo */}
        <div className='flex flex-1 flex-col gap-4'>
          <div className='h-8 w-2/3 rounded bg-white/10' />
          <div className='h-4 w-1/3 rounded bg-white/10' />
          <div className='h-4 w-full rounded bg-white/10' />
          <div className='h-4 w-5/6 rounded bg-white/10' />
        </div>
      </div>
    </section>
  );
}
