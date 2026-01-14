export function CardSkeleton() {
  return (
    <div
      className='
        shrink-0
        w-35
        sm:w-40
        md:w-45
        lg:w-50
        xl:w-55
        animate-pulse
      '
    >
      <div className='aspect-2/3 rounded-xl bg-border' />

      <div className='mt-3 space-y-2'>
        <div className='h-4 w-3/4 rounded bg-border' />
        <div className='h-3 w-1/2 rounded bg-border' />
      </div>
    </div>
  );
}
