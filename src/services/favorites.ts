import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/Api";
import { Favorite } from "@/types/Favorite";
import { cookies } from "next/headers";

/**
 * Leitura de favoritos no servidor. Antes esta função fazia um fetch para a
 * própria API (`APP_URL/api/favorites`); consultar o banco direto elimina o
 * round-trip e a dependência de `APP_URL` estar configurada.
 */
export async function getFavorites(): Promise<ApiResponse<Favorite[]>> {
  const token = (await cookies()).get("auth")?.value;

  if (!token) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  let userId: number;
  try {
    userId = verifyToken(token).id;
  } catch {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      select: { itemId: true, itemType: true },
      orderBy: { id: "desc" },
    });

    return { ok: true, data: favorites };
  } catch {
    return { ok: false, status: 500, error: "Failed to load favorites" };
  }
}
