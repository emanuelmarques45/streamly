"use client";

import { useEffect, useState } from "react";
import { toggleFavorite, getFavorites } from "@/services/favorites";
import { useAuth } from "@/context/AuthContext";
import { HeartIcon } from "@/components/ui/HeartIcon";

export function FavoriteButton({ movieId }: { movieId: number }) {
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function checkFavorite() {
      const res = await getFavorites();
      if (res.ok) {
        setFavorited(res.data.includes(movieId));
      }
      setChecking(false);
    }

    checkFavorite();
  }, [user, movieId]);

  if (!user || checking) return null;

  async function handleToggle() {
    setLoading(true);
    const res = await toggleFavorite(movieId);
    setLoading(false);

    if (res.ok) {
      setFavorited(res.data.favorited);
    }
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
