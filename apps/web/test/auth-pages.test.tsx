import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { RegisterForm } from '../src/features/auth/register-form';

describe('RegisterForm', () => {
  it('focuses the error summary and links errors to fields', async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSubmit={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /criar acesso/i }));
    const summary = await screen.findByRole('alert');
    expect(summary).toHaveFocus();
    expect(screen.getByLabelText(/e-mail/i)).toHaveAccessibleDescription();
  });
});
