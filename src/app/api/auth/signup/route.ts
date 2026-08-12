import { emailToHash, signToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/utils/response";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return fail("Requisição inválida", 400);
  }

  const { name, email, password } = body;

  if (!name || !email || !password) {
    return fail("Preencha todos os campos", 400);
  }

  // Name
  const trimmedName = typeof name === "string" ? name.trim() : "";
  if (trimmedName.length < 2) {
    return fail("O nome deve ter pelo menos 2 caracteres", 400);
  }

  // Email
  const normalizedEmail =
    typeof email === "string" ? email.toLowerCase().trim() : "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    return fail("E-mail inválido", 400);
  }

  // Password
  const pwd = typeof password === "string" ? password : "";
  const pwdRegex = /^(?=.*[A-Za-z])(?=.*[\d\W]).{8,}$/;

  if (!pwdRegex.test(pwd)) {
    return fail(
      "A senha deve ter pelo menos 8 caracteres e incluir letras e ao menos um número ou símbolo",
      400
    );
  }

  // Reject the e-mail before hashing: bcrypt is the expensive step.
  try {
    const exists = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (exists) {
      return fail("Já existe uma conta com este e-mail", 409);
    }
  } catch {
    return fail("Erro interno do servidor", 500);
  }

  // Hash password
  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(pwd, 10);
  } catch {
    return fail("Erro interno do servidor", 500);
  }

  // Create user
  try {
    const user = await prisma.user.create({
      data: {
        name: trimmedName,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

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

    // Same session cookie the login route sets.
    res.cookies.set("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    // P2002 = unique constraint violation (race between two signups).
    const code = (err as { code?: string })?.code;

    if (code === "P2002") {
      return fail("Já existe uma conta com este e-mail", 409);
    }

    return fail("Erro interno do servidor", 500);
  }
}
