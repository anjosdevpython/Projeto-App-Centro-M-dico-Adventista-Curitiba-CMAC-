import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { RegisterForm } from '../src/features/auth/register-form';

describe('RegisterForm Stitch UI', () => {
  it('switches between patient and medical team tabs', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    expect(screen.getByRole('tab', { name: /sou paciente/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText(/cpf ou número do prontuário/i)).toBeInTheDocument();

    const doctorTab = screen.getByRole('tab', { name: /corpo clínico/i });
    await user.click(doctorTab);

    expect(doctorTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/crm \/ uf ou matrícula médica/i)).toBeInTheDocument();
  });

  it('generates patient credentials and gives portal access on submit', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const submitBtn = screen.getByRole('button', { name: /entrar com segurança/i });
    await user.click(submitBtn);

    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/acesso demonstrativo liberado/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /acessar portal do paciente/i })).toHaveAttribute(
      'href',
      '/inicio',
    );
  });

  it('generates doctor credentials when submitting on doctor profile', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.click(screen.getByRole('tab', { name: /corpo clínico/i }));
    await user.click(screen.getByRole('button', { name: /entrar com segurança/i }));

    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/equipe médica conectada/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /acessar agenda do corpo clínico/i })).toHaveAttribute(
      'href',
      '/medico',
    );
  });

  it('allows quick 1-touch login with biometric button', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const bioBtn = screen.getByRole('button', { name: /entrar com biometria/i });
    await user.click(bioBtn);

    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/acesso demonstrativo liberado/i)).toBeInTheDocument();
  });
});
