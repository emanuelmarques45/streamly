"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { FAVORITES_QUERY_KEY } from "@/lib/queryKeys";
import { fetchFavorites, toggleFavorite } from "@/services/favorites.client";
import { Favorite, favoriteKey } from "@/types/Favorite";

export { FAVORITES_QUERY_KEY };

/**
 * Fonte única de verdade dos favoritos no cliente.
 *
 * Antes cada `FavoriteButton` buscava a lista inteira no mount — com vários
 * botões na tela isso virava uma requisição por card. Agora todos compartilham
 * a mesma query em cache e o toggle é otimista.
 */
export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: ({ signal }) => fetchFavorites(signal),
    enabled: Boolean(user),
    staleTime: 60 * 1000,
  });

  const favorites = useMemo(() => query.data ?? [], [query.data]);

  const keys = useMemo(
    () => new Set(favorites.map(favoriteKey)),
    [favorites]
  );

  const mutation = useMutation({
    mutationFn: toggleFavorite,
    onMutate: async (favorite: Favorite) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });

      const previous =
        queryClient.getQueryData<Favorite[]>(FAVORITES_QUERY_KEY) ?? [];

      const key = favoriteKey(favorite);
      const alreadyFavorited = previous.some((f) => favoriteKey(f) === key);

      queryClient.setQueryData<Favorite[]>(
        FAVORITES_QUERY_KEY,
        alreadyFavorited
          ? previous.filter((f) => favoriteKey(f) !== key)
          : [favorite, ...previous]
      );

      return { previous };
    },
    onError: (_error, _favorite, context) => {
      if (context) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  const isFavorite = useCallback(
    (favorite: Favorite) => keys.has(favoriteKey(favorite)),
    [keys]
  );

  const isTogglingItem = useCallback(
    (favorite: Favorite) =>
      mutation.isPending &&
      mutation.variables !== undefined &&
      favoriteKey(mutation.variables) === favoriteKey(favorite),
    [mutation.isPending, mutation.variables]
  );

  return {
    favorites,
    /** `false` enquanto a lista do usuário logado ainda não chegou. */
    isReady: !user || !query.isLoading,
    isAuthenticated: Boolean(user),
    isFavorite,
    isTogglingItem,
    toggle: mutation.mutate,
    error: query.error,
  };
}
