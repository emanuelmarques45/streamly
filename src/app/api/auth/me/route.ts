import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  const token = (await cookies()).get("auth")?.value;

  if (!token) {
    return NextResponse.json(null);
  }

  try {
    const user = verifyToken(token);
    return NextResponse.json(user);
  } catch {
    return NextResponse.json(null);
  }
}
