"use client";

import { useEffect, useState } from "react";
import { getFavorites } from "@/services/favorites";
import { useAuth } from "@/context/AuthContext";
import { HeartIcon } from "@/components/ui/HeartIcon";
import { Favorite } from "@/types/Favorite";
import { useQueryClient } from "@tanstack/react-query";
import { toggleFavorite } from "@/services/favorites.client";

export function FavoriteButton({ itemId, itemType }: Favorite) {
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    async function checkFavorite() {
      const res = await getFavorites();
      if (res.ok) {
        const isFav = res.data.some(
          (fav: any) => fav.itemId === itemId && fav.itemType === itemType
        );

        setFavorited(isFav);
      }
      setChecking(false);
    }

    checkFavorite();
  }, [user, itemId, itemType]);

  if (!user || checking) return null;

  async function handleToggle() {
    setLoading(true);
    const res = await toggleFavorite({ itemId, itemType });
    setLoading(false);

    if (res.ok) {
      setFavorited(res.data.favorited);
    }

    queryClient.invalidateQueries({
      queryKey: ["favorites"],
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label='Toggle favorite'
      className='group p-1'
    >
      <HeartIcon filled={favorited} loading={loading} />
    </button>
  );
}
