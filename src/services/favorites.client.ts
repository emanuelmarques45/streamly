"use client";

import { ApiResponse } from "@/types/Api";
import { Favorite } from "@/types/Favorite";

export async function toggleFavorite({
  itemId,
  itemType,
}: Favorite): Promise<ApiResponse<{ favorited: boolean }>> {
  try {
    const res = await fetch(`/api/favorites/${itemId}`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ itemType }),
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
