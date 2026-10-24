# Dependency record

Consulted on 24 October 2026 through the npm registry.

| Dependency | Selected version | Reason |
| --- | ---: | --- |
| Node.js | 22 LTS in CI; local compatibility through 24 | Supported LTS baseline |
| pnpm | 11.20.0 | Installed stable package manager |
| Next.js | 16.4.3 | Current stable registry release |
| React | 19.3.1 | Current stable registry release |
| Fastify | 5.12.7 | Current stable registry release |
| Zod | 4.6.7 | Current stable registry release |
| Drizzle ORM | 0.45.4 | Current stable registry release |
| Vitest | 5.0.5 | Current stable registry release |
| TypeScript | 7.0.2 | Current stable registry release |

Before production rollout, recheck compatibility matrices in the official Node.js, Next.js, React, Fastify, Zod, Drizzle, Vitest, and TypeScript documentation and update through a tested dependency change.
