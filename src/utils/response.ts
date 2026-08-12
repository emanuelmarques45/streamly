import { ApiResponse } from "@/types/Api";
import { NextResponse } from "next/server";

type OkOptions = {
  status?: number;
  /** `Cache-Control` header, used by the public catalog routes. */
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
 * The status goes both in the body (for consumers of the `ApiResponse`
 * envelope) and in the HTTP response. It used to live in the body only, which
 * made every failure reach the client as a 200.
 */
function fail(message: string, status = 400) {
  return NextResponse.json<ApiResponse<never>>(
    { ok: false, error: message, status },
    { status }
  );
}

export { ok, fail };
