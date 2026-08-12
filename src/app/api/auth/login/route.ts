import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { signToken, emailToHash } from "@/lib/jwt";
import { fail, ok } from "@/utils/response";

// Dummy hash so bcrypt.compare takes a similar time when the user is missing.
const DUMMY_HASH = bcrypt.hashSync("__DUMMY_PASSWORD__", 10);

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return fail("Requisição inválida", 400);
  }

  const { email, password } = body;

  if (!email || !password) {
    return fail("Informe o e-mail e a senha", 400);
  }

  let user;
  try {
    user = await prisma.user.findUnique({ where: { email } });
  } catch {
    return fail("Erro inesperado. Tente novamente.", 500);
  }

  const hashToCompare = user?.password ?? DUMMY_HASH;

  const valid = await bcrypt.compare(password, hashToCompare);

  if (!valid || !user) {
    return fail("E-mail ou senha inválidos", 401);
  }

  const token = signToken({
    id: user.id,
    name: user.name,
    emailHash: emailToHash(user.email),
  });

  const res = ok({
    id: user.id,
    name: user.name,
    email: user.email,
  });

  res.cookies.set("auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
