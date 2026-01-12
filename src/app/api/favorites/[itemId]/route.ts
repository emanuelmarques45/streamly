import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/utils/response";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params;

  const body = await req.json();
  const { itemType } = body; // "MOVIE" | "TV"

  const token = (await cookies()).get("auth")?.value;
  if (!token) return fail("Unauthorized", 401);

  let user;
  try {
    user = verifyToken(token);
  } catch {
    return fail("Unauthorized", 401);
  }

  const id = Number(itemId);
  if (!id) return fail("Invalid item id");

  const validItemTypes = ["MOVIE", "TV"] as const;
  if (!itemType || !validItemTypes.includes(itemType)) {
    return fail("Invalid item type");
  }

  const exists = await prisma.favorite.findUnique({
    where: {
      userId_itemId_itemType: {
        userId: user.id,
        itemId: id,
        itemType,
      },
    },
  });

  // REMOVE
  if (exists) {
    await prisma.favorite.delete({
      where: { id: exists.id },
    });

    return ok({ favorited: false });
  }

  // ADD
  await prisma.favorite.create({
    data: {
      userId: user.id,
      itemId: id,
      itemType,
    },
  });

  return ok({ favorited: true });
}
