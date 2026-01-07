import { Container } from "@/components/layout/Container";
import { LoginForm } from "@/components/domain/LoginForm";

export default function LoginPage() {
  return (
    <Container className='max-w-md py-16'>
      <h1 className='mb-2 text-2xl font-semibold'>Login</h1>
      <p className='mb-8 text-sm text-text-muted'>Access your account</p>

      <LoginForm />
    </Container>
  );
}
