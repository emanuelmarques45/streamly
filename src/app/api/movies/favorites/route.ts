import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/utils/response";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  const token = (await cookies()).get("auth")?.value;
  if (!token) return fail("Unauthorized", 401);

  let user;
  try {
    user = verifyToken(token);
  } catch {
    return fail("Unauthorized", 401);
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: { movieId: true },
  });

  return ok(favorites.map((f) => f.movieId));
}
