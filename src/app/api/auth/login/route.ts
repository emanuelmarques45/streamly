import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  const res = NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });

  res.cookies.set("auth", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return res;
}
