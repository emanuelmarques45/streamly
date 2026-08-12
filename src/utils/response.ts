import { ApiResponse } from "@/types/Api";
import { NextResponse } from "next/server";

type OkOptions = {
  status?: number;
  /** Header `Cache-Control` — usado pelas rotas de catálogo, que são públicas. */
  cacheControl?: string;
};

function ok<T>(data: T, { status = 200, cacheControl }: OkOptions = {}) {
  return NextResponse.json<ApiResponse<T>>(
    { ok: true, data },
    {
      status,
      headers: cacheControl ? { "Cache-Control": cacheControl } : undefined,
    }
  );
}

/**
 * O status vai tanto no corpo (para quem consome o envelope `ApiResponse`)
 * quanto na resposta HTTP — antes só existia no corpo, o que fazia toda falha
 * chegar ao cliente como 200.
 */
function fail(message: string, status = 400) {
  return NextResponse.json<ApiResponse<never>>(
    { ok: false, error: message, status },
    { status }
  );
}

export { ok, fail };
