import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { LoginForm } from "@/components/domain/LoginForm";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta para salvar filmes e séries favoritos.",
};

export default function LoginPage() {
  return (
    <Container className='max-w-md py-16'>
      <h1 className='mb-2 text-2xl font-semibold'>Entrar</h1>
      <p className='mb-8 text-sm text-text-muted'>
        Acesse sua conta para salvar seus favoritos.
      </p>

      <LoginForm />

      <p className='mt-6 text-sm text-text-muted'>
        Ainda não tem conta?{" "}
        <Link href='/signup' className='text-primary hover:underline'>
          Criar conta
        </Link>
      </p>
    </Container>
  );
}
