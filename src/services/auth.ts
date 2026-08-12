import { ApiResponse } from "@/types/Api";
import { safeJson } from "@/utils/safeJson";

export type User = {
  id: number;
  name: string | null;
  /** Absent from the session (`/api/auth/me`): the JWT stores no plain e-mail. */
  email?: string | null;
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
        error: "Resposta inválida do servidor",
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
  } catch {
    return {
      ok: false,
      status: 0,
      error: "Erro de conexão. Verifique sua internet.",
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
        error: "Resposta inválida do servidor",
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
  } catch {
    return {
      ok: false,
      status: 0,
      error: "Erro de conexão. Verifique sua internet.",
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
        error: "Não foi possível sair da conta",
      };
    }

    return { ok: true, data: null };
  } catch {
    return {
      ok: false,
      status: 0,
      error: "Erro de conexão. Verifique sua internet.",
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
        error: "Resposta inválida do servidor",
      };
    }

    return body;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return {
        ok: false,
        status: 0,
        error: "Requisição cancelada",
      };
    }

    return {
      ok: false,
      status: 0,
      error: "Erro de conexão. Verifique sua internet.",
    };
  }
}
