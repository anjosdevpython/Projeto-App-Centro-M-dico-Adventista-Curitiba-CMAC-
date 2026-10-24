import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { RegisterForm } from '../src/features/auth/register-form';

describe('RegisterForm', () => {
  it('focuses the error summary and links errors to fields when empty', async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSubmit={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /criar acesso/i }));
    const summary = await screen.findByRole('alert');
    expect(summary).toHaveFocus();
    expect(screen.getByLabelText(/e-mail/i)).toHaveAccessibleDescription();
  });

  it('displays generated credentials and provides portal transition upon valid submission with default onSubmit', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    await user.type(screen.getByLabelText(/e-mail/i), 'paciente.teste@exemplo.com');
    await user.type(screen.getByLabelText(/senha de acesso/i), 'senhaForte1234');
    await user.click(screen.getByRole('button', { name: /criar acesso/i }));

    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/credenciais demonstrativas geradas com sucesso/i)).toBeInTheDocument();
    expect(screen.getByText(/paciente.teste@exemplo.com/i)).toBeInTheDocument();
    expect(screen.getByText(/CMAC-DEMO-2026-/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /acessar portal demonstrativo/i })).toHaveAttribute('href', '/inicio');
  });

  it('allows resetting to register another email after credentials generation', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    await user.type(screen.getByLabelText(/e-mail/i), 'outro.paciente@exemplo.com');
    await user.type(screen.getByLabelText(/senha de acesso/i), 'senhaForte1234');
    await user.click(screen.getByRole('button', { name: /criar acesso/i }));

    expect(await screen.findByRole('status')).toBeInTheDocument();
    const resetButton = screen.getByRole('button', { name: /cadastrar outro e-mail/i });
    await user.click(resetButton);

    expect(screen.getByRole('button', { name: /criar acesso/i })).toBeInTheDocument();
  });
});
