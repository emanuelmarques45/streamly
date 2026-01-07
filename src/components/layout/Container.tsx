import clsx from "clsx";
import { ComponentProps } from "react";

type ContainerProps = ComponentProps<"div">;

export function Container({ children, className, ...rest }: ContainerProps) {
  return (
    <div
      className={clsx("mx-auto w-full max-w-7xl px-4 md:px-6", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
