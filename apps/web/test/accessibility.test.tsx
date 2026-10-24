import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { PortalShell } from '../src/components/portal-shell';
import { RegisterForm } from '../src/features/auth/register-form';

describe('Accessibility tests', () => {
  it('has no automated accessibility violations in the portal shell', async () => {
    const { container } = render(
      <PortalShell>
        <main>
          <h1>Início</h1>
        </main>
      </PortalShell>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });

  it('has no automated accessibility violations in register form initial and credentials views', async () => {
    const user = userEvent.setup();
    const { container } = render(<RegisterForm />);

    expect((await axe(container)).violations).toEqual([]);

    await user.type(screenByLabel('E-mail'), 'paciente.teste@exemplo.com');
    await user.type(screenByLabel('Senha de acesso'), 'senhaValida1234');
    await user.click(container.querySelector('button[type="submit"]') as HTMLElement);

    expect((await axe(container)).violations).toEqual([]);
  });
});

function screenByLabel(text: string): HTMLElement {
  const labels = Array.from(document.querySelectorAll('label'));
  const targetLabel = labels.find((l) => l.textContent?.includes(text));
  if (!targetLabel) throw new Error(`Label ${text} not found`);
  const inputId = targetLabel.getAttribute('for');
  const input = document.getElementById(inputId || '');
  if (!input) throw new Error(`Input for label ${text} not found`);
  return input;
}
