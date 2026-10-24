# Portal de Autoatendimento CMAC

Portal web administrativo, mobile-first e acessível do **Centro Médico Adventista Curitiba (CMAC)**. O projeto permite evoluir cadastro, autenticação, catálogo e ciclo de agendamento sem confundir a demonstração sintética com atendimento real.

> Estado atual: protótipo técnico em modo `demo`. Não realiza atendimentos reais e não está integrado ao ambiente produtivo do SOUL MV.

## Fonte de verdade

Leia os documentos nesta ordem:

1. [`docs/SDD.md`](docs/SDD.md) — visão consolidada, requisitos, arquitetura, decisões, estado e critérios de produção.
2. [`docs/HISTORY.md`](docs/HISTORY.md) — evolução da ideia e registro cronológico das decisões.
3. [`docs/PROMPTS.md`](docs/PROMPTS.md) — contexto e prompts seguros para continuar o trabalho.
4. [`docs/superpowers/plans/2026-10-23-clinica-atendimento-automation.md`](docs/superpowers/plans/2026-10-23-clinica-atendimento-automation.md) — plano executável detalhado.

Em caso de divergência, prevalecem, nesta ordem: solicitação mais recente do responsável pelo projeto, `docs/SDD.md`, especificação detalhada e plano de implementação.

## Execução local

Requisitos: Node.js 22–24 e pnpm 11.

```bash
pnpm install
pnpm test
pnpm --filter @cmac/web dev
```

Use somente dados sintéticos. Copie `.env.example` para um arquivo local não versionado e mantenha `APP_ENV=demo` e `SOUL_MV_ADAPTER=demo` até haver autorização formal e documentação de homologação.

## Validação disponível

```bash
pnpm test
pnpm --filter @cmac/api typecheck
pnpm --filter @cmac/web typecheck
pnpm --filter @cmac/web build
```

O Docker não foi validado na estação de desenvolvimento original porque o executável não estava disponível. A integração real com SOUL MV, migrações contra PostgreSQL real, E2E e operação de produção continuam pendentes.
