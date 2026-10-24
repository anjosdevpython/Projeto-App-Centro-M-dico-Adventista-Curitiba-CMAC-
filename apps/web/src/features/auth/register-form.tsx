'use client';

import { useRef, useState, type FormEvent } from 'react';

import { FormField } from '../../components/form-field';

export function RegisterForm({
  onSubmit = () => undefined,
}: {
  onSubmit?: (input: { email: string; password: string }) => void | Promise<void>;
}) {
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const summary = useRef<HTMLDivElement>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '');
    const password = String(data.get('password') ?? '');
    const next = {
      ...(!email.includes('@') ? { email: 'Informe um e-mail válido.' } : {}),
      ...(password.length < 12 ? { password: 'Use pelo menos 12 caracteres.' } : {}),
    };
    setErrors(next);
    if (Object.keys(next).length) {
      queueMicrotask(() => summary.current?.focus());
      return;
    }
    void onSubmit({ email, password });
  }

  return (
    <form className="auth-card" onSubmit={submit} noValidate>
      <div ref={summary} tabIndex={-1} role={Object.keys(errors).length ? 'alert' : undefined} className="error-summary">
        {Object.keys(errors).length ? 'Revise os campos destacados.' : null}
      </div>
      <FormField id="email" name="email" type="email" autoComplete="email" label="E-mail" error={errors.email} />
      <FormField id="password" name="password" type="password" autoComplete="new-password" label="Senha de acesso" error={errors.password} />
      <button className="primary-button" type="submit">Criar acesso</button>
    </form>
  );
}
