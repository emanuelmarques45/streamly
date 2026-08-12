"use client";

import { useEffect, useRef, useState } from "react";
import { Video } from "@/types/Video";

type TrailerDialogProps = {
  trailer: Video;
  title: string;
};

/**
 * Opens the trailer in a native `<dialog>`. The iframe is only mounted after the
 * click, so the detail page does not load the YouTube player for nothing.
 */
export function TrailerDialog({ trailer, title }: TrailerDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => setIsOpen(false);
    dialog.addEventListener("close", handleClose);

    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  function open() {
    setIsOpen(true);
    dialogRef.current?.showModal();
  }

  return (
    <>
      <button
        type='button'
        onClick={open}
        className='inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90'
      >
        <span aria-hidden='true'>▶</span>
        Assistir trailer
      </button>

      <dialog
        ref={dialogRef}
        aria-label={`Trailer de ${title}`}
        onClick={(event) => {
          // A click on the backdrop (outside the content) closes the modal.
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        className='m-auto w-[min(90vw,960px)] rounded-xl bg-black p-0 backdrop:bg-black/70'
      >
        {isOpen && (
          <div className='relative aspect-video w-full'>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0`}
              title={trailer.name}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              className='h-full w-full'
            />

            <button
              type='button'
              onClick={() => dialogRef.current?.close()}
              aria-label='Fechar trailer'
              className='absolute right-2 top-2 rounded-full bg-black/70 px-3 py-1 text-white'
            >
              ✕
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
