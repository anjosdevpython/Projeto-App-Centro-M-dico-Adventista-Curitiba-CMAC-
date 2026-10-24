import { describe, expect, it } from 'vitest';

import { CatalogService } from '../src/catalog/service.js';
import { DemoSoulMvAdapter } from '../src/integrations/soul-mv/demo-adapter.js';
import { HttpSoulMvAdapter } from '../src/integrations/soul-mv/http-adapter.js';
import { soulMvContract } from './soul-mv-contract.js';

describe('DemoSoulMvAdapter contract', () => {
  soulMvContract(() => new DemoSoulMvAdapter());
});

describe('CatalogService', () => {
  it('returns the official CMAC display name and synthetic catalog metadata', async () => {
    const catalog = await new CatalogService(new DemoSoulMvAdapter()).getCatalog();
    expect(catalog.institutionName).toBe('Centro Médico Adventista Curitiba');
    expect(catalog.environment).toBe('demo');
    expect(catalog.specialties.every((item) => item.isSynthetic)).toBe(true);
  });
});

describe('HttpSoulMvAdapter', () => {
  it('cannot start without authorized homologation configuration', () => {
    expect(() => new HttpSoulMvAdapter({} as never)).toThrow(/homologação/i);
  });
});
