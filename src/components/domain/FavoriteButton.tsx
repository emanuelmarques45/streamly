"use client";

import { usePathname, useRouter } from "next/navigation";
import { HeartIcon } from "@/components/ui/HeartIcon";
import { useFavorites } from "@/hooks/useFavorites";
import { Favorite } from "@/types/Favorite";
import clsx from "clsx";

type FavoriteButtonProps = Favorite & {
  size?: "sm" | "md";
  className?: string;
};

export function FavoriteButton({
  itemId,
  itemType,
  size = "md",
  className,
}: FavoriteButtonProps) {
  const { isFavorite, isTogglingItem, toggle, isAuthenticated, isReady } =
    useFavorites();

  const router = useRouter();
  const pathname = usePathname();

  const favorite: Favorite = { itemId, itemType };
  const favorited = isFavorite(favorite);
  const pending = isTogglingItem(favorite);

  function handleClick(event: React.MouseEvent) {
    // Em cards o botão fica sobre um <Link>: sem isso o clique navega.
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    toggle(favorite);
  }

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={!isReady}
      aria-pressed={favorited}
      aria-label={
        favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"
      }
      title={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={clsx(
        "group rounded-full p-1 transition disabled:opacity-40",
        className
      )}
    >
      <HeartIcon
        filled={favorited}
        loading={pending}
        className={size === "sm" ? "h-5 w-5" : "h-8 w-8"}
      />
    </button>
  );
}
