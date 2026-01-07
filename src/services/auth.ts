import { ApiResponse } from "@/types/Api";
import { fail, ok } from "@/utils/response";
import { safeJson } from "@/utils/safeJson";
import { NextResponse } from "next/server";

export type User = {
  id: number;
  name: string | null;
  email: string | null;
};

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<ApiResponse<User>> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const body = await safeJson<ApiResponse<User>>(res);

    if (!body) {
      return {
        ok: false,
        status: res.status,
        error: "Invalid server response",
      };
    }

    if (!body.ok) {
      return {
        ok: false,
        status: res.status,
        error: body.error,
      };
    }

    return {
      ok: true,
      data: body.data,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

export async function signup({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiResponse<User>> {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });

    const body = await safeJson<ApiResponse<User>>(res);

    if (!body) {
      return {
        ok: false,
        status: res.status,
        error: "Invalid server response",
      };
    }

    if (!body.ok) {
      return {
        ok: false,
        status: res.status,
        error: body.error,
      };
    }

    return {
      ok: true,
      data: body.data,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

export async function logout(): Promise<ApiResponse<null>> {
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: "Logout failed",
      };
    }

    return { ok: true, data: null };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

export async function getMe(options?: {
  signal?: AbortSignal;
}): Promise<ApiResponse<User | null>> {
  try {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      signal: options?.signal,
    });

    const body = await safeJson<ApiResponse<User | null>>(res);

    if (!body) {
      return {
        ok: false,
        status: res.status,
        error: "Invalid server response",
      };
    }

    return body;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return {
        ok: false,
        status: 0,
        error: "Request aborted",
      };
    }

    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

export default { login, signup, logout, getMe };
