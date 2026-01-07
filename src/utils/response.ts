import { ApiResponse } from "@/types/Api";
import { NextResponse } from "next/server";

function ok<T>(data: T) {
  return NextResponse.json<ApiResponse<T>>({
    ok: true,
    data,
  });
}

function fail(message: string, status = 400) {
  return NextResponse.json<ApiResponse<never>>({
    ok: false,
    error: message,
    status: status,
  });
}

export { ok, fail };
