import { RegisterForm } from '../../features/auth/register-form';

export default function RegisterPage() {
  return (
    <main className="page">
      <p className="eyebrow">Acesso seguro</p>
      <h1>Crie seu acesso</h1>
      <p className="lead">Use um e-mail válido. CPF isolado não autentica ninguém.</p>
      <RegisterForm />
    </main>
  );
}
