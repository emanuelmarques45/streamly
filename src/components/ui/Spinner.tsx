import clsx from "clsx";

type SpinnerProps = {
  size?: number;
  className?: string;
  label?: string;
};

export function Spinner({
  size = 24,
  className,
  label = "Carregando",
}: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      role='status'
      aria-label={label}
      // `text-white` sumia no tema claro — agora herda a cor do texto.
      className={clsx("animate-spin text-current", className)}
    >
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'
        fill='none'
      />
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
      />
    </svg>
  );
}
