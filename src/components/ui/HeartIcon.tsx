import clsx from "clsx";

type HeartIconProps = {
  filled?: boolean;
  loading?: boolean;
  className?: string;
};

export function HeartIcon({ filled, loading, className }: HeartIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      aria-hidden='true'
      className={clsx(
        "transition drop-shadow",
        filled ? "fill-red-500" : "fill-black/30",
        "stroke-red-500",
        loading ? "animate-pulse opacity-60" : "group-hover:scale-110",
        className ?? "h-8 w-8"
      )}
      strokeWidth='2'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M11.995 20.727l-1.45-1.32C5.4 14.36 2 11.278 2 7.497 2 4.42 4.42 2 7.497 2c1.74 0 3.41.81 4.498 2.09C13.084 2.81 14.755 2 16.495 2 19.573 2 22 4.42 22 7.497c0 3.781-3.4 6.863-8.545 11.91l-1.46 1.32z'
      />
    </svg>
  );
}
