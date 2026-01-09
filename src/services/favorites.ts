"use client";

import { ApiResponse } from "@/types/Api";

export async function toggleFavorite(
  movieId: number
): Promise<ApiResponse<{ favorited: boolean }>> {
  try {
    const res = await fetch(`/api/movies/favorites/${movieId}`, {
      method: "POST",
      credentials: "include",
    });

    return await res.json();
  } catch {
    return {
      ok: false,
      status: 0,
      error: "Network error",
    };
  }
}

export async function getFavorites(): Promise<ApiResponse<number[]>> {
  try {
    const res = await fetch("/api/movies/favorites", {
      credentials: "include",
    });

    return await res.json();
  } catch {
    return {
      ok: false,
      status: 0,
      error: "Network error",
    };
  }
}
