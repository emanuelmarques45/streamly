import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/utils/response";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { NextApiRequest } from "next";

export async function POST(
  req: NextApiRequest,
  { params }: { params: Promise<{ movieId: string }> }
) {
  const { movieId: id } = await params;
  const token = (await cookies()).get("auth")?.value;
  if (!token) return fail("Unauthorized", 401);

  let user;
  try {
    user = verifyToken(token);
  } catch {
    return fail("Unauthorized", 401);
  }

  const movieId = Number(id);
  if (!movieId) return fail("Invalid movie id");

  const exists = await prisma.favorite.findUnique({
    where: {
      userId_movieId: {
        userId: user.id,
        movieId,
      },
    },
  });

  if (exists) {
    await prisma.favorite.delete({
      where: { id: exists.id },
    });

    return ok({ favorited: false });
  }

  await prisma.favorite.create({
    data: {
      userId: user.id,
      movieId,
    },
  });

  return ok({ favorited: true });
}
