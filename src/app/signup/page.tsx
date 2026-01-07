import { Container } from "@/components/layout/Container";
import { SignupForm } from "@/components/domain/SignupForm";

export default function SignupPage() {
  return (
    <Container className='max-w-md py-16'>
      <h1 className='mb-2 text-2xl font-semibold'>Create account</h1>
      <p className='mb-8 text-sm text-text-muted'>Sign up to get started</p>

      <SignupForm />
    </Container>
  );
}
