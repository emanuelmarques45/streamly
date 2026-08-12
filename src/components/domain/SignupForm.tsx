"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signup } from "@/services/auth";
import { safeRedirect } from "@/utils/redirect";
import { Spinner } from "../ui/Spinner";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { refreshUser } = useAuth();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await signup({ name, email, password });

    if (!res.ok) {
      setError(res.error);
      setIsLoading(false);
      return;
    }

    await refreshUser();
    setIsLoading(false);

    const params = new URLSearchParams(window.location.search);
    router.push(safeRedirect(params.get("redirect")));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-5' noValidate>
      <label className='block'>
        <span className='text-sm text-text-muted'>Nome</span>
        <input
          type='text'
          required
          autoComplete='name'
          value={name}
          onChange={(event) => setName(event.target.value)}
          className='w-full border-b border-border bg-transparent px-1 py-2 outline-none focus:border-primary'
          autoFocus
        />
      </label>

      <label className='block'>
        <span className='text-sm text-text-muted'>E-mail</span>
        <input
          type='email'
          required
          autoComplete='email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className='w-full border-b border-border bg-transparent px-1 py-2 outline-none focus:border-primary'
        />
      </label>

      <label className='block'>
        <span className='text-sm text-text-muted'>Senha</span>
        <input
          type='password'
          required
          autoComplete='new-password'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-describedby='password-hint'
          className='w-full border-b border-border bg-transparent px-1 py-2 outline-none focus:border-primary'
        />
        <span id='password-hint' className='mt-1 block text-xs text-text-muted'>
          Mínimo de 8 caracteres, com letras e ao menos um número ou símbolo.
        </span>
      </label>

      {error && (
        <p role='alert' className='text-sm text-red-500'>
          {error}
        </p>
      )}

      <button
        type='submit'
        disabled={isLoading}
        className='flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2 text-white transition disabled:opacity-50'
      >
        {isLoading && <Spinner size={16} />}
        {isLoading ? "Criando conta…" : "Criar conta"}
      </button>
    </form>
  );
}
