import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { expect, it } from 'vitest';

import { PortalShell } from '../src/components/portal-shell';

it('has no automated accessibility violations in the portal shell', async () => {
  const { container } = render(<PortalShell><main><h1>Início</h1></main></PortalShell>);
  expect((await axe(container)).violations).toEqual([]);
});
