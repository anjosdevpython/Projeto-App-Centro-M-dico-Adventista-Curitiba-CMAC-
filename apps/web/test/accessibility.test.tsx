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

    const submitBtn = container.querySelector('button[type="submit"]') as HTMLElement;
    await user.click(submitBtn);

    expect((await axe(container)).violations).toEqual([]);
  });
});
