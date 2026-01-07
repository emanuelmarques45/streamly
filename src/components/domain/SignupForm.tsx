"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/services/auth";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await signup({ name, email, password });

    setIsLoading(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    router.push("/login");
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      <input
        type='text'
        placeholder='Name'
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className='w-full border-b border-border bg-transparent px-1 py-2 outline-none focus:border-primary'
      />

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
        {isLoading ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}
