import { describe, expect, it } from 'vitest';

import { validateEnv } from '../scripts/validate-env.mjs';

describe('validateEnv', () => {
  it('accepts an explicit demo environment', () => {
    const environment = validateEnv({
      APP_ENV: 'demo',
      DATABASE_URL: 'postgres://clinic:clinic@localhost:5432/clinic',
      SESSION_SECRET: '0123456789abcdef0123456789abcdef',
      PUBLIC_ORIGIN: 'http://localhost:3000',
      SOUL_MV_ADAPTER: 'demo',
    });

    expect(environment.appEnv).toBe('demo');
    expect(environment.soulMvAdapter).toBe('demo');
  });

  it('rejects a real adapter without authorized configuration', () => {
    expect(() =>
      validateEnv({
        APP_ENV: 'homologation',
        DATABASE_URL: 'postgres://clinic:clinic@localhost:5432/clinic',
        SESSION_SECRET: '0123456789abcdef0123456789abcdef',
        PUBLIC_ORIGIN: 'https://homolog.example.test',
        SOUL_MV_ADAPTER: 'http',
      }),
    ).toThrow(/SOUL_MV_BASE_URL/);
  });
});
