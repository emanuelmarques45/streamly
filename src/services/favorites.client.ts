"use client";

import { ApiResponse } from "@/types/Api";
import { Favorite } from "@/types/Favorite";
import { safeJson } from "@/utils/safeJson";

async function unwrap<T>(res: Response): Promise<T> {
  const body = await safeJson<ApiResponse<T>>(res);

  if (!body) throw new Error("Invalid server response");
  if (!body.ok) throw new Error(body.error);

  return body.data;
}

export async function fetchFavorites(
  signal?: AbortSignal
): Promise<Favorite[]> {
  const res = await fetch("/api/favorites", {
    credentials: "include",
    signal,
  });

  // A signed-out visitor is not an error: they simply have no favorites.
  if (res.status === 401) return [];

  return unwrap<Favorite[]>(res);
}

export async function toggleFavorite({
  itemId,
  itemType,
}: Favorite): Promise<{ favorited: boolean }> {
  const res = await fetch(`/api/favorites/${itemId}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemType }),
  });

  return unwrap<{ favorited: boolean }>(res);
}
