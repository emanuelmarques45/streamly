import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { ok } from "@/utils/response";

export async function GET() {
  const token = (await cookies()).get("auth")?.value;

  if (!token) return ok(null);

  try {
    const { id, name } = verifyToken(token);
    // Devolve o mesmo envelope `ApiResponse` das outras rotas.
    return ok({ id, name: name ?? null });
  } catch {
    return ok(null);
  }
}
