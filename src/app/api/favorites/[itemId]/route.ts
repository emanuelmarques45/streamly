import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { isFavoriteType } from "@/types/Favorite";
import { parseId } from "@/utils/params";
import { fail, ok } from "@/utils/response";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const token = (await cookies()).get("auth")?.value;
  if (!token) return fail("Não autorizado", 401);

  let userId: number;
  try {
    userId = verifyToken(token).id;
  } catch {
    return fail("Não autorizado", 401);
  }

  const { itemId } = await params;
  const id = parseId(itemId);
  if (!id) return fail("Identificador inválido", 400);

  // A malformed body used to crash the route with an unhandled 500.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Requisição inválida", 400);
  }

  const itemType = (body as { itemType?: unknown })?.itemType;
  if (!isFavoriteType(itemType)) {
    return fail("Tipo de item inválido", 400);
  }

  try {
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_itemId_itemType: { userId, itemId: id, itemType },
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return ok({ favorited: false });
    }

    await prisma.favorite.create({
      data: { userId, itemId: id, itemType },
    });

    return ok({ favorited: true });
  } catch {
    return fail("Não foi possível atualizar o favorito", 500);
  }
}
