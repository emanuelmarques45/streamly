"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

type MediaScrollerProps = {
  children: React.ReactNode;
  /** Ref forwarded to the container; used by the infinite-scroll sentinel. */
  containerRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
  label?: string;
};

/**
 * Horizontal carousel with arrows on larger screens. Each arrow only shows up
 * when there is content to scroll toward on that side.
 */
export function MediaScroller({
  children,
  containerRef,
  className,
  label,
}: MediaScrollerProps) {
  const internalRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function currentElement() {
    return containerRef?.current ?? internalRef.current;
  }

  useEffect(() => {
    const el = containerRef?.current ?? internalRef.current;
    if (!el) return;

    function updateArrows() {
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 8);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    }

    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });

    // Newly loaded pages change the width without firing a scroll event.
    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateArrows);
      observer.disconnect();
    };
  }, [containerRef]);

  function scrollBy(direction: 1 | -1) {
    const el = currentElement();
    if (!el) return;

    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className='group/scroller relative'>
      <div
        ref={(node) => {
          internalRef.current = node;
          if (containerRef) containerRef.current = node;
        }}
        role='list'
        aria-label={label}
        className={clsx(
          "flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth",
          className
        )}
      >
        {children}
      </div>

      <ScrollArrow
        direction='left'
        visible={canScrollLeft}
        onClick={() => scrollBy(-1)}
      />
      <ScrollArrow
        direction='right'
        visible={canScrollRight}
        onClick={() => scrollBy(1)}
      />
    </div>
  );
}

function ScrollArrow({
  direction,
  visible,
  onClick,
}: {
  direction: "left" | "right";
  visible: boolean;
  onClick: () => void;
}) {
  if (!visible) return null;

  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={direction === "left" ? "Rolar para trás" : "Rolar para frente"}
      className={clsx(
        `absolute top-1/2 hidden -translate-y-1/2 rounded-full bg-background/90
         p-3 text-lg shadow-lg ring-1 ring-border transition
         hover:bg-background md:flex
         opacity-0 group-hover/scroller:opacity-100 focus-visible:opacity-100`,
        direction === "left" ? "left-0 -ml-2" : "right-0 -mr-2"
      )}
    >
      <span aria-hidden='true'>{direction === "left" ? "‹" : "›"}</span>
    </button>
  );
}
