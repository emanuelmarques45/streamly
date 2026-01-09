import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/utils/response";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid request body", 400);
  }

  const { name, email, password } = body;

  if (!name || !email || !password) {
    return fail("Missing fields", 400);
  }

  // Name
  const trimmedName = typeof name === "string" ? name.trim() : "";
  if (trimmedName.length < 2) {
    return fail("Name must be at least 2 characters", 400);
  }

  // Email
  const normalizedEmail =
    typeof email === "string" ? email.toLowerCase().trim() : "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    return fail("Invalid email address", 400);
  }

  // Password
  const pwd = typeof password === "string" ? password : "";
  const pwdRegex = /^(?=.*[A-Za-z])(?=.*[\d\W]).{8,}$/;

  if (!pwdRegex.test(pwd)) {
    return fail(
      "Password must be at least 8 characters and include letters and numbers or symbols",
      400
    );
  }

  // Check existing user
  try {
    const exists = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (exists) {
      return fail("User already exists", 409);
    }
  } catch (err) {
    return fail("Internal server error", 500);
  }

  // Hash password
  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(pwd, 10);
  } catch (err) {
    return fail("Internal server error", 500);
  }

  // Create user
  try {
    const createdUser = await prisma.user.create({
      data: {
        name: trimmedName,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    return ok({
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
    });
  } catch (err: any) {
    if (err?.code === "P2002" || err?.meta?.target?.includes("email")) {
      return fail("User already exists", 409);
    }

    return fail("Internal server error", 500);
  }
}
