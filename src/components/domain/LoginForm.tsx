"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { refreshUser } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return;

    await refreshUser();
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      <input
        type='email'
        placeholder='Email'
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='w-full border-b border-border bg-transparent px-1 py-2 outline-none focus:border-primary'
      />

      <input
        type='password'
        placeholder='Password'
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='w-full border-b border-border bg-transparent px-1 py-2 outline-none focus:border-primary'
      />

      {error && <p className='text-sm text-red-500'>{error}</p>}

      <button
        type='submit'
        disabled={isLoading}
        className='w-full rounded-md bg-primary py-2 text-white transition disabled:opacity-50'
      >
        {isLoading ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}
