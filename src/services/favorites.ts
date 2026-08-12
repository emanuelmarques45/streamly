import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/Api";
import { Favorite } from "@/types/Favorite";
import { cookies } from "next/headers";

/**
 * Server-side read of the user's favorites. This used to fetch the app's own
 * API (`APP_URL/api/favorites`); querying the database directly removes the
 * round-trip and the dependency on `APP_URL` being set.
 */
export async function getFavorites(): Promise<ApiResponse<Favorite[]>> {
  const token = (await cookies()).get("auth")?.value;

  if (!token) {
    return { ok: false, status: 401, error: "Não autorizado" };
  }

  let userId: number;
  try {
    userId = verifyToken(token).id;
  } catch {
    return { ok: false, status: 401, error: "Não autorizado" };
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      select: { itemId: true, itemType: true },
      orderBy: { id: "desc" },
    });

    return { ok: true, data: favorites };
  } catch {
    return { ok: false, status: 500, error: "Não foi possível carregar os favoritos" };
  }
}
