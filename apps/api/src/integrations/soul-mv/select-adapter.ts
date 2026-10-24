import { DemoSoulMvAdapter } from './demo-adapter.js';
import { HttpSoulMvAdapter } from './http-adapter.js';
import type { SoulMvPort } from './port.js';

export function selectSoulMvAdapter(
  mode: 'demo' | 'http',
  realConfig?: ConstructorParameters<typeof HttpSoulMvAdapter>[0],
): SoulMvPort {
  if (mode === 'demo') return new DemoSoulMvAdapter();
  return new HttpSoulMvAdapter(realConfig as never);
}
