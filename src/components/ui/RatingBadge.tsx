import clsx from "clsx";
import { formatRating } from "@/utils/format";

type RatingBadgeProps = {
  value?: number | null;
  className?: string;
};

/** Cor da nota: verde ≥ 7, âmbar ≥ 5, vermelho abaixo disso. */
function toneFor(rating: number) {
  if (rating >= 7) return "text-emerald-600 dark:text-emerald-400";
  if (rating >= 5) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

export function RatingBadge({ value, className }: RatingBadgeProps) {
  const rating = formatRating(value);

  if (!rating) {
    return (
      <span className={clsx("text-sm text-text-muted", className)}>
        Sem nota
      </span>
    );
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 text-sm font-medium",
        toneFor(Number(rating)),
        className
      )}
    >
      <span aria-hidden='true'>★</span>
      <span className='sr-only'>Nota</span>
      {rating}
    </span>
  );
}
