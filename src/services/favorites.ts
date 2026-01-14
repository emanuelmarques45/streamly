"use server";

import { ApiResponse } from "@/types/Api";
import { Favorite } from "@/types/Favorite";
import { cookies } from "next/headers";

export async function getFavorites(): Promise<ApiResponse<Favorite[]>> {
  try {
    const authToken = (await cookies()).get("auth")?.value.toString();
    const res = await fetch(`${process.env.APP_URL}/api/favorites`, {
      credentials: "include",
      headers: {
        "Cookie": `auth=${authToken}`,
      },
    });

    return await res.json();
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: "Network error",
    };
  }
}
