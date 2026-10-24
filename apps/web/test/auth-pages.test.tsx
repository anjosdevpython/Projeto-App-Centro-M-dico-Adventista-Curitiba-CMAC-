import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { RegisterForm } from '../src/features/auth/register-form';

describe('RegisterForm', () => {
  it('generates patient credentials with 1-click button', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const quickBtn = screen.getByRole('button', { name: /gerar credencial de paciente/i });
    await user.click(quickBtn);

    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/credencial de paciente ativa/i)).toBeInTheDocument();
    expect(screen.getByText(/paciente.demonstrativo@cmac.demo/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /acessar portal demonstrativo/i })).toHaveAttribute('href', '/inicio');
  });

  it('generates medical team credentials with 1-click button', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const quickDocBtn = screen.getByRole('button', { name: /gerar credencial da equipe médica/i });
    await user.click(quickDocBtn);

    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/credencial da equipe médica ativa/i)).toBeInTheDocument();
    expect(screen.getByText(/CRM-PR 28941/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /acessar painel da equipe médica/i })).toHaveAttribute('href', '/inicio');
  });

  it('generates credentials via manual form submission', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const emailInput = screen.getByLabelText(/^e-mail/i);
    await user.clear(emailInput);
    await user.type(emailInput, 'novo.paciente@exemplo.com');

    await user.click(screen.getByRole('button', { name: /^criar acesso$/i }));

    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/novo.paciente@exemplo.com/i)).toBeInTheDocument();
  });
});
