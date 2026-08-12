import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SignupForm } from "@/components/domain/SignupForm";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta gratuita e monte sua lista de favoritos.",
};

export default function SignupPage() {
  return (
    <Container className='max-w-md py-16'>
      <h1 className='mb-2 text-2xl font-semibold'>Criar conta</h1>
      <p className='mb-8 text-sm text-text-muted'>
        Leva menos de um minuto e libera a lista de favoritos.
      </p>

      <SignupForm />

      <p className='mt-6 text-sm text-text-muted'>
        Já tem uma conta?{" "}
        <Link href='/login' className='text-primary hover:underline'>
          Entrar
        </Link>
      </p>
    </Container>
  );
}
