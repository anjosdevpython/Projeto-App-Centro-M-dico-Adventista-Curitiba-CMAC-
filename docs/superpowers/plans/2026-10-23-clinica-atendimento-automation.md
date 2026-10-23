# Clínica Adventista Atendimento Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar um piloto Docker funcional que automatize de ponta a ponta as jornadas administrativas da clínica com Chatwoot, n8n, Integration Core e um simulador contratual da Soul MV.

**Architecture:** Chatwoot mantém os canais e o histórico; n8n orquestra jornadas importáveis; uma API Fastify/TypeScript concentra contratos, regras, idempotência, persistência e adaptadores. PostgreSQL é a fonte de verdade, Redis fornece locks/cache, e mocks substituíveis permitem demonstrar tudo antes das credenciais reais.

**Tech Stack:** Node.js 22 LTS, pnpm 10, TypeScript 5.7, Fastify 5, Zod 3, Drizzle ORM, PostgreSQL 16, Redis 7.4, Vitest 3, n8n 2.44.5, Chatwoot 4.17.1, Docker Compose, Caddy 2.9, Prometheus e Grafana.

**Spec:** `docs/superpowers/specs/2026-10-23-clinica-atendimento-automation-design.md`

## Global Constraints

- Nenhuma etapa administrativa normal exige atendente; handoff humano é contingência.
- Não diagnosticar, interpretar sintomas, recomendar tratamento ou dar orientação médica.
- O piloto usa somente dados sintéticos.
- n8n chama apenas a API interna; formatos Soul MV ficam restritos aos adaptadores.
- Toda mutação externa exige idempotência e auditoria.
- Segredos nunca entram no Git nem nos JSONs do n8n.
- O sistema funciona sem provedor de IA por meio de menus determinísticos.
- Imagens de produção permanecem fixadas em `n8nio/n8n:2.44.5` e `chatwoot/chatwoot:v4.17.1` até atualização validada.

## File Map

```text
apps/core/                       API e regras administrativas
  src/app.ts                     composição Fastify
  src/config.ts                  ambiente validado
  src/modules/catalog/           catálogo e orientação administrativa
  src/modules/patients/          identificação mínima
  src/modules/appointments/      disponibilidade e marcações
  src/modules/waitlist/          oferta concorrente de vagas
  src/modules/messages/          cadências e templates
  src/modules/handoff/           contingência Chatwoot
  src/modules/audit/             eventos sanitizados
  src/ports/soul-mv.ts           contrato independente da MV
  src/adapters/soul-mv-mock/     implementação sintética
  src/adapters/soul-mv-http/     casca desativada para API real
  src/db/                        schema, migrações e repositórios
  test/                          unitários, contrato e integração
apps/mv-mock/                    servidor HTTP que simula cenários externos
workflows/n8n/                   JSONs importáveis e manifesto
infra/compose/                   stacks dev e produção
infra/caddy/                     proxy e TLS
infra/observability/             métricas, dashboards e alertas
scripts/                         bootstrap, importação e smoke tests
docs/runbooks/                   instalação, operação, backup e homologação
```

---

### Task 1: Workspace executável e verificação local

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `.editorconfig`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `scripts/verify-env.mjs`
- Test: `test/verify-env.test.ts`

**Interfaces:**
- Produces: comandos raiz `pnpm test`, `pnpm lint`, `pnpm typecheck`; variáveis validadas por `scripts/verify-env.mjs`.

- [ ] **Step 1: Escrever o teste de ambiente**

```ts
import { describe, expect, it } from 'vitest';
import { validateEnv } from '../scripts/verify-env.mjs';

describe('validateEnv', () => {
  it('rejects missing secrets and accepts explicit mock configuration', () => {
    expect(() => validateEnv({ APP_MODE: 'pilot' })).toThrow('DATABASE_URL');
    expect(validateEnv({
      APP_MODE: 'pilot', DATABASE_URL: 'postgres://app:app@db/app',
      REDIS_URL: 'redis://redis:6379', INTERNAL_API_KEY: 'x'.repeat(32),
      SOUL_MV_MODE: 'mock', WHATSAPP_MODE: 'mock'
    }).SOUL_MV_MODE).toBe('mock');
  });
});
```

- [ ] **Step 2: Executar o teste e confirmar falha**

Run: `pnpm exec vitest run test/verify-env.test.ts`
Expected: FAIL porque `scripts/verify-env.mjs` ainda não existe.

- [ ] **Step 3: Criar workspace, scripts e validador**

```json
{
  "name": "clinica-atendimento-automation",
  "private": true,
  "packageManager": "pnpm@10.18.1",
  "scripts": {
    "test": "vitest run",
    "lint": "eslint .",
    "typecheck": "tsc -b",
    "verify:env": "node scripts/verify-env.mjs"
  },
  "dependencies": { "zod": "3.25.76" },
  "devDependencies": { "typescript": "5.7.3", "vitest": "3.2.4", "eslint": "9.38.0" }
}
```

Implementar `validateEnv` com Zod, exigir as cinco variáveis mostradas no teste e rejeitar `SOUL_MV_MODE=live` sem `SOUL_MV_BASE_URL` e `SOUL_MV_API_KEY`. Incluir `.superpowers/`, `.env`, volumes, backups e artefatos de teste no `.gitignore`; preservar o PDF existente.

- [ ] **Step 4: Instalar e validar**

Run: `pnpm install && pnpm test && pnpm typecheck`
Expected: todos os testes passam e o TypeScript não relata erros.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json .editorconfig .gitignore .env.example scripts/verify-env.mjs test/verify-env.test.ts pnpm-lock.yaml
git commit -m "chore: initialize automation workspace"
```

### Task 2: Contratos internos e portas de integração

**Files:**
- Create: `apps/core/package.json`
- Create: `apps/core/tsconfig.json`
- Create: `apps/core/src/domain/contracts.ts`
- Create: `apps/core/src/ports/soul-mv.ts`
- Create: `apps/core/src/ports/messaging.ts`
- Test: `apps/core/test/contracts.test.ts`

**Interfaces:**
- Produces: `SoulMvPort`, `MessagingPort`, `PatientRef`, `ServiceOffering`, `AvailabilitySlot`, `Appointment`, `PreparationInstruction`.

- [ ] **Step 1: Escrever testes de contrato Zod**

```ts
it('rejects clinical advice and accepts administrative catalog entries', () => {
  expect(ServiceOfferingSchema.parse({ id:'cardio-first', name:'Consulta inicial de cardiologia', kind:'consultation', unitIds:['u1'] }).kind).toBe('consultation');
  expect(() => ServiceOfferingSchema.parse({ id:'x', name:'Você tem arritmia', kind:'diagnosis', unitIds:['u1'] })).toThrow();
});
```

- [ ] **Step 2: Confirmar falha**

Run: `pnpm --filter @clinica/core test -- contracts.test.ts`
Expected: FAIL por módulos inexistentes.

- [ ] **Step 3: Definir tipos e assinaturas**

```ts
export interface SoulMvPort {
  findPatient(input: PatientLookup): Promise<PatientRef | null>;
  listServices(input: ServiceQuery): Promise<ServiceOffering[]>;
  listAvailability(input: AvailabilityQuery): Promise<AvailabilitySlot[]>;
  createAppointment(input: CreateAppointmentCommand): Promise<Appointment>;
  cancelAppointment(input: CancelAppointmentCommand): Promise<Appointment>;
  rescheduleAppointment(input: RescheduleAppointmentCommand): Promise<Appointment>;
  getPreparation(serviceId: string): Promise<PreparationInstruction[]>;
}
```

Definir IDs opacos, datas ISO-8601 com timezone, enum de status e schemas Zod correspondentes. `MessagingPort.send()` recebe `MessageCommand` e retorna `MessageReceipt`.

- [ ] **Step 4: Rodar testes e tipos**

Run: `pnpm --filter @clinica/core test && pnpm --filter @clinica/core typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/core
git commit -m "feat: define integration contracts"
```

### Task 3: Banco, idempotência e auditoria sanitizada

**Files:**
- Create: `apps/core/src/db/schema.ts`
- Create: `apps/core/src/db/client.ts`
- Create: `apps/core/src/db/migrations/0001_initial.sql`
- Create: `apps/core/src/modules/idempotency/service.ts`
- Create: `apps/core/src/modules/audit/service.ts`
- Test: `apps/core/test/integration/idempotency.test.ts`
- Test: `apps/core/test/audit.test.ts`

**Interfaces:**
- Consumes: contratos da Task 2.
- Produces: `IdempotencyService.execute<T>(key, operation, fn)` e `AuditService.record(event)`.

- [ ] **Step 1: Testar repetição e mascaramento**

```ts
it('executes the same mutation once', async () => {
  let calls = 0;
  const first = await service.execute('evt-1','appointment.create',async()=>({ id:`a-${++calls}` }));
  const second = await service.execute('evt-1','appointment.create',async()=>({ id:`a-${++calls}` }));
  expect(second).toEqual(first); expect(calls).toBe(1);
});

it('masks protected fields', () => {
  expect(sanitize({ cpf:'12345678901', phone:'41999998888', token:'secret' }))
    .toEqual({ cpf:'***8901', phone:'***8888', token:'[REDACTED]' });
});
```

- [ ] **Step 2: Confirmar falha com PostgreSQL de teste**

Run: `docker compose -f infra/compose/test.yml up -d postgres && pnpm --filter @clinica/core test -- idempotency.test.ts audit.test.ts`
Expected: FAIL por schema e serviços inexistentes.

- [ ] **Step 3: Implementar migração e serviços**

Criar tabelas `journeys`, `idempotency_keys`, `appointments`, `waitlist_entries`, `message_deliveries`, `consents` e `audit_events`. Usar índice único `(key, operation)`, transação e armazenamento do resultado JSON. Sanitizar `cpf`, `phone`, `email`, `token`, `authorization` e `messageBody` antes de persistir auditoria.

- [ ] **Step 4: Validar concorrência**

Run: `pnpm --filter @clinica/core test -- idempotency.test.ts audit.test.ts`
Expected: PASS inclusive com dez chamadas concorrentes para a mesma chave.

- [ ] **Step 5: Commit**

```bash
git add apps/core/src/db apps/core/src/modules/idempotency apps/core/src/modules/audit apps/core/test
git commit -m "feat: add persistence idempotency and audit"
```

### Task 4: Adaptador Soul MV sintético e servidor de cenários

**Files:**
- Create: `apps/core/src/adapters/soul-mv-mock/index.ts`
- Create: `apps/core/src/adapters/soul-mv-mock/fixtures.ts`
- Create: `apps/mv-mock/package.json`
- Create: `apps/mv-mock/src/server.ts`
- Create: `apps/mv-mock/src/scenarios.ts`
- Test: `apps/core/test/contract/soul-mv-adapter.contract.ts`

**Interfaces:**
- Consumes: `SoulMvPort`.
- Produces: `createSoulMvMockAdapter(seed)` e HTTP mock com `X-Mock-Scenario: success|conflict|timeout|rate-limit|unauthorized`.

- [ ] **Step 1: Escrever suíte contratual reutilizável**

```ts
export function soulMvContract(make: () => SoulMvPort) {
  it('lists slots and prevents double booking', async () => {
    const api = make();
    const [slot] = await api.listAvailability({ serviceId:'cardio-first', unitId:'u1', from:'2026-11-01', to:'2026-11-30' });
    await api.createAppointment({ idempotencyKey:'k1', patientId:'p1', slotId:slot.id });
    await expect(api.createAppointment({ idempotencyKey:'k2', patientId:'p2', slotId:slot.id })).rejects.toMatchObject({ code:'SLOT_UNAVAILABLE' });
  });
}
```

- [ ] **Step 2: Confirmar falha**

Run: `pnpm --filter @clinica/core test -- soul-mv-adapter.contract.ts`
Expected: FAIL por adaptador inexistente.

- [ ] **Step 3: Implementar fixtures e cenários**

Incluir duas unidades, oito especialidades, doze profissionais, consultas iniciais/retornos, cinco exames, preparos sintéticos e trinta dias de horários. O mock deve aceitar clock injetável, reproduzir cenários por header e nunca conter nomes/CPFs reais.

- [ ] **Step 4: Executar contrato e smoke HTTP**

Run: `pnpm --filter @clinica/core test -- soul-mv-adapter.contract.ts && pnpm --filter @clinica/mv-mock test`
Expected: PASS para sucesso, conflito, timeout, limite e não autorizado.

- [ ] **Step 5: Commit**

```bash
git add apps/core/src/adapters/soul-mv-mock apps/core/test/contract apps/mv-mock
git commit -m "feat: add contractual Soul MV simulator"
```

### Task 5: API Integration Core e autenticação interna

**Files:**
- Create: `apps/core/src/config.ts`
- Create: `apps/core/src/app.ts`
- Create: `apps/core/src/server.ts`
- Create: `apps/core/src/http/auth.ts`
- Create: `apps/core/src/http/errors.ts`
- Create: `apps/core/src/http/routes/catalog.ts`
- Create: `apps/core/src/http/routes/appointments.ts`
- Create: `apps/core/src/http/routes/health.ts`
- Test: `apps/core/test/http/app.test.ts`

**Interfaces:**
- Produces: REST `/v1/catalog/services`, `/v1/availability`, `/v1/appointments`, `/v1/appointments/:id/cancel`, `/v1/appointments/:id/reschedule`, `/health/live`, `/health/ready`.

- [ ] **Step 1: Testar autenticação e mutação idempotente**

```ts
it('requires API key and idempotency key', async () => {
  expect((await app.inject({ method:'GET', url:'/v1/catalog/services' })).statusCode).toBe(401);
  expect((await app.inject({ method:'POST', url:'/v1/appointments', headers:{'x-internal-api-key':key}, payload:{} })).statusCode).toBe(400);
});
```

- [ ] **Step 2: Confirmar falha**

Run: `pnpm --filter @clinica/core test -- app.test.ts`
Expected: FAIL por `buildApp` inexistente.

- [ ] **Step 3: Implementar rotas e envelope de erro**

```json
{ "error": { "code": "SLOT_UNAVAILABLE", "message": "Horário indisponível", "retryable": false, "correlationId": "req-123" } }
```

Validar todos os payloads com Zod, exigir `X-Internal-Api-Key` e `Idempotency-Key` nas mutações, mapear timeout/429/401/409 e registrar auditoria sanitizada.

- [ ] **Step 4: Executar testes HTTP**

Run: `pnpm --filter @clinica/core test -- app.test.ts`
Expected: PASS para autenticação, validação, criação, repetição, conflito e healthchecks.

- [ ] **Step 5: Commit**

```bash
git add apps/core/src/config.ts apps/core/src/app.ts apps/core/src/server.ts apps/core/src/http apps/core/test/http
git commit -m "feat: expose secured integration API"
```

### Task 6: Orientação administrativa e conteúdo aprovado

**Files:**
- Create: `content/catalog/services.pt-BR.json`
- Create: `content/messages/templates.pt-BR.json`
- Create: `apps/core/src/modules/catalog/service.ts`
- Create: `apps/core/src/modules/catalog/safety.ts`
- Test: `apps/core/test/catalog.test.ts`

**Interfaces:**
- Produces: `CatalogService.search(query, filters)` e `classifyAdministrativeIntent(text)` com `confidence`, `intent`, `entities`, `requiresHuman`.

- [ ] **Step 1: Testar busca e limite clínico**

```ts
it.each(['estou com dor no peito','qual remédio devo tomar','isso é câncer?'])('routes clinical text to safety: %s', async text => {
  expect((await classifyAdministrativeIntent(text)).requiresHuman).toBe(true);
});
it('explains a consultation administratively', async () => {
  expect((await catalog.search('consulta cardiologia primeira vez',{}))[0].id).toBe('cardio-first');
});
```

- [ ] **Step 2: Confirmar falha**

Run: `pnpm --filter @clinica/core test -- catalog.test.ts`
Expected: FAIL por catálogo inexistente.

- [ ] **Step 3: Implementar menus determinísticos e catálogo**

Cada item deve conter `id`, `displayName`, `kind`, `description`, `unitIds`, `documentRequirements`, `acceptedPlanIds`, `searchTerms` e `clinicalDisclaimer`. Conteúdo de preparo fica marcado `approvalStatus: "synthetic-demo"` e não pode ser habilitado em produção sem `approvedBy` e `approvedAt`.

- [ ] **Step 4: Validar conteúdo**

Run: `pnpm --filter @clinica/core test -- catalog.test.ts`
Expected: PASS, incluindo rejeição de diagnóstico e recomendação terapêutica.

- [ ] **Step 5: Commit**

```bash
git add content apps/core/src/modules/catalog apps/core/test/catalog.test.ts
git commit -m "feat: add safe administrative guidance catalog"
```

### Task 7: Agendamento, cancelamento, reagendamento e lista de espera

**Files:**
- Create: `apps/core/src/modules/appointments/service.ts`
- Create: `apps/core/src/modules/appointments/locks.ts`
- Create: `apps/core/src/modules/waitlist/service.ts`
- Test: `apps/core/test/appointments.test.ts`
- Test: `apps/core/test/waitlist.test.ts`

**Interfaces:**
- Produces: `AppointmentService.book/cancel/reschedule` e `WaitlistService.offerNext/acceptOffer/expireOffer`.

- [ ] **Step 1: Testar ciclo completo e concorrência**

```ts
it('keeps the old appointment when replacement fails', async () => {
  const old = await service.book(command('slot-1','k1'));
  await expect(service.reschedule({ appointmentId:old.id, slotId:'occupied', idempotencyKey:'k2' })).rejects.toMatchObject({ code:'SLOT_UNAVAILABLE' });
  expect((await repo.get(old.id))?.status).toBe('confirmed');
});
```

- [ ] **Step 2: Confirmar falha**

Run: `pnpm --filter @clinica/core test -- appointments.test.ts waitlist.test.ts`
Expected: FAIL por serviços inexistentes.

- [ ] **Step 3: Implementar locks e estados**

Usar lock Redis `slot:{slotId}` com token e expiração de 30 segundos. Estados da oferta: `queued`, `offered`, `accepted`, `expired`, `closed`; índice único impede duas aceitações para a mesma vaga. Reagendamento preserva a marcação anterior até confirmação da nova.

- [ ] **Step 4: Executar testes concorrentes**

Run: `pnpm --filter @clinica/core test -- appointments.test.ts waitlist.test.ts`
Expected: PASS com vinte aceitações simultâneas e apenas uma vencedora.

- [ ] **Step 5: Commit**

```bash
git add apps/core/src/modules/appointments apps/core/src/modules/waitlist apps/core/test/appointments.test.ts apps/core/test/waitlist.test.ts
git commit -m "feat: automate appointment lifecycle"
```

### Task 8: Cadências de mensagens e adaptador Chatwoot

**Files:**
- Create: `apps/core/src/modules/messages/service.ts`
- Create: `apps/core/src/modules/messages/schedule.ts`
- Create: `apps/core/src/adapters/chatwoot/client.ts`
- Create: `apps/core/src/modules/handoff/service.ts`
- Test: `apps/core/test/messages.test.ts`
- Test: `apps/core/test/chatwoot.test.ts`

**Interfaces:**
- Produces: `MessageScheduleService.plan/cancelObsolete`, `ChatwootClient.sendMessage`, `HandoffService.transfer`.

- [ ] **Step 1: Testar cadência e encerramento**

```ts
it('cancels old reminders after reschedule', async () => {
  await scheduler.plan(appointment('a1','2026-11-20T10:00:00-03:00'));
  await scheduler.cancelObsolete('a1','rescheduled');
  expect(await repo.pendingFor('a1')).toEqual([]);
});
```

- [ ] **Step 2: Confirmar falha**

Run: `pnpm --filter @clinica/core test -- messages.test.ts chatwoot.test.ts`
Expected: FAIL por serviços inexistentes.

- [ ] **Step 3: Implementar D-7/D-2/D-1/dia e handoff**

Persistir cada entrega com chave `appointmentId:templateId:scheduledAt`. `transfer()` adiciona rótulo `automation_handoff`, atribui ao time configurado e publica nota privada com intenção, etapa, dados validados e correlation ID; nunca inclui CPF completo ou token.

- [ ] **Step 4: Validar com servidor HTTP simulado**

Run: `pnpm --filter @clinica/core test -- messages.test.ts chatwoot.test.ts`
Expected: PASS para envio, deduplicação, cancelamento de cadência, erro 429 e handoff sanitizado.

- [ ] **Step 5: Commit**

```bash
git add apps/core/src/modules/messages apps/core/src/adapters/chatwoot apps/core/src/modules/handoff apps/core/test/messages.test.ts apps/core/test/chatwoot.test.ts
git commit -m "feat: add messaging cadence and human fallback"
```

### Task 9: Workflows n8n importáveis

**Files:**
- Create: `workflows/n8n/manifest.json`
- Create: `workflows/n8n/01-chatwoot-ingress.json`
- Create: `workflows/n8n/02-intent-router.json`
- Create: `workflows/n8n/03-guidance-and-booking.json`
- Create: `workflows/n8n/04-cancel-reschedule.json`
- Create: `workflows/n8n/05-reminders-preparation.json`
- Create: `workflows/n8n/06-waitlist.json`
- Create: `workflows/n8n/07-post-visit.json`
- Create: `workflows/n8n/08-error-handler.json`
- Create: `scripts/validate-workflows.mjs`
- Test: `test/workflows.test.ts`

**Interfaces:**
- Consumes: REST da Task 5 e Chatwoot webhooks.
- Produces: oito workflows com IDs estáveis, sem credenciais embutidas.

- [ ] **Step 1: Testar os invariantes dos JSONs**

```ts
it('contains no secret and every HTTP mutation sends idempotency', async () => {
  for (const flow of loadWorkflows()) {
    expect(JSON.stringify(flow)).not.toMatch(/Bearer\s+|api[_-]?key\s*[:=]\s*[A-Za-z0-9]{16}/i);
    for (const node of mutationNodes(flow)) expect(node.parameters.headerParameters).toContainEqual(expect.objectContaining({ name:'Idempotency-Key' }));
  }
});
```

- [ ] **Step 2: Confirmar falha**

Run: `pnpm exec vitest run test/workflows.test.ts`
Expected: FAIL porque os oito JSONs não existem.

- [ ] **Step 3: Criar workflows completos**

Cada JSON deve usar Webhook/Schedule Trigger, Set para normalização, Switch para roteamento, HTTP Request apontando para `{{$env.CORE_BASE_URL}}`, Wait quando necessário, e Error Trigger central. Usar `{{$json.event_id}}:{{$json.action}}` como chave de idempotência e credencial do tipo Header Auth referenciada por nome, nunca valor.

- [ ] **Step 4: Importar em n8n efêmero e validar**

Run: `docker compose -f infra/compose/dev.yml run --rm n8n n8n import:workflow --separate --input=/workflows/n8n && node scripts/validate-workflows.mjs`
Expected: oito imports bem-sucedidos, zero segredo e todas as referências resolvidas.

- [ ] **Step 5: Commit**

```bash
git add workflows/n8n scripts/validate-workflows.mjs test/workflows.test.ts
git commit -m "feat: add importable n8n patient journeys"
```

### Task 10: Stack Docker, Chatwoot e bootstrap reproduzível

**Files:**
- Create: `infra/compose/dev.yml`
- Create: `infra/compose/prod.yml`
- Create: `infra/compose/test.yml`
- Create: `infra/caddy/Caddyfile`
- Create: `apps/core/Dockerfile`
- Create: `apps/mv-mock/Dockerfile`
- Create: `scripts/bootstrap.ps1`
- Create: `scripts/bootstrap.sh`
- Create: `scripts/import-n8n.ps1`
- Create: `scripts/create-chatwoot-inbox.mjs`
- Test: `scripts/smoke-stack.mjs`

**Interfaces:**
- Produces: stack com `core`, `mv-mock`, `postgres`, `redis`, `n8n`, `chatwoot-web`, `chatwoot-worker`, `caddy`, `prometheus`, `grafana`.

- [ ] **Step 1: Escrever smoke test**

```js
const checks = [
  ['core','http://localhost:3001/health/ready'],
  ['n8n','http://localhost:5678/healthz'],
  ['chatwoot','http://localhost:3000/api'],
  ['mv-mock','http://localhost:3010/health']
];
for (const [name,url] of checks) if (!(await fetch(url)).ok) throw new Error(`${name} unhealthy`);
```

- [ ] **Step 2: Confirmar falha**

Run: `node scripts/smoke-stack.mjs`
Expected: FAIL porque o stack não existe.

- [ ] **Step 3: Criar Compose e bootstrap**

Fixar n8n `2.44.5`, Chatwoot `v4.17.1`, PostgreSQL `16.10-alpine`, Redis `7.4.5-alpine` e Caddy `2.9.1-alpine`. Healthchecks bloqueiam dependentes; volumes têm nomes explícitos; apenas Caddy publica portas em produção. O bootstrap valida `.env`, aplica migrações, cria conta/inbox do widget, importa workflows e imprime URLs locais.

- [ ] **Step 4: Subir ambiente limpo e executar smoke**

Run: `docker compose -f infra/compose/dev.yml up -d --build && node scripts/smoke-stack.mjs`
Expected: todos os serviços saudáveis e oito workflows importados.

- [ ] **Step 5: Commit**

```bash
git add infra apps/core/Dockerfile apps/mv-mock/Dockerfile scripts
git commit -m "feat: add reproducible clinic automation stack"
```

### Task 11: Observabilidade, backup e segurança operacional

**Files:**
- Create: `infra/observability/prometheus.yml`
- Create: `infra/observability/alerts.yml`
- Create: `infra/observability/grafana/provisioning/datasources.yml`
- Create: `infra/observability/grafana/provisioning/dashboards.yml`
- Create: `infra/observability/grafana/dashboards/clinic-automation.json`
- Create: `scripts/backup.ps1`
- Create: `scripts/restore.ps1`
- Create: `scripts/scan-secrets.mjs`
- Test: `test/operations.test.ts`

**Interfaces:**
- Produces: métricas `journey_started_total`, `journey_completed_total`, `handoff_total`, `integration_errors_total`, `appointment_operations_total`, histogramas de latência e backup restaurável.

- [ ] **Step 1: Testar painel, alertas e scanner**

```ts
it('defines operational alerts and contains no secrets', () => {
  expect(read('infra/observability/alerts.yml')).toContain('IntegrationErrorRateHigh');
  expect(scanRepository()).toEqual([]);
});
```

- [ ] **Step 2: Confirmar falha**

Run: `pnpm exec vitest run test/operations.test.ts`
Expected: FAIL por artefatos ausentes.

- [ ] **Step 3: Implementar métricas e operação**

Alertar se taxa de erro externo superar 5% por 10 minutos, readiness ficar indisponível por 2 minutos ou dead-letter crescer. Backup usa `pg_dump --format=custom`, checksum SHA-256 e diretório datado; restore exige banco de destino explícito e nunca sobrescreve o banco padrão.

- [ ] **Step 4: Ensaiar restauração**

Run: `pwsh scripts/backup.ps1 -OutputDirectory .artifacts/backups; pwsh scripts/restore.ps1 -BackupFile .artifacts/backups/latest.dump -TargetDatabase clinic_restore_test; pnpm test`
Expected: checksum válido, restore em banco isolado e suíte verde.

- [ ] **Step 5: Commit**

```bash
git add infra/observability scripts/backup.ps1 scripts/restore.ps1 scripts/scan-secrets.mjs test/operations.test.ts
git commit -m "feat: add observability and recoverability"
```

### Task 12: Jornada ponta a ponta e documentação de entrega

**Files:**
- Create: `test/e2e/patient-journey.test.ts`
- Create: `test/e2e/failure-journey.test.ts`
- Create: `docs/runbooks/INSTALL.md`
- Create: `docs/runbooks/OPERATIONS.md`
- Create: `docs/runbooks/BACKUP-RESTORE.md`
- Create: `docs/runbooks/INCIDENTS.md`
- Create: `docs/runbooks/SOUL-MV-HOMOLOGATION.md`
- Create: `docs/runbooks/WHATSAPP-ACTIVATION.md`
- Create: `docs/runbooks/CLINIC-GO-LIVE-CHECKLIST.md`
- Create: `README.md`

**Interfaces:**
- Consumes: stack e jornadas das Tasks 1–11.
- Produces: piloto verificável e roteiro exato para ativar APIs reais.

- [ ] **Step 1: Escrever E2E do ciclo integral**

```ts
it('guides, books, reminds, reschedules and cancels without an attendant', async () => {
  const chat = await patient.start('Quero marcar cardiologista');
  await chat.choose('Consulta inicial de cardiologia');
  await chat.choose('Unidade 1');
  const booking = await chat.chooseFirstAvailable();
  await clock.advanceTo(booking.startAt.minus({ days:2 }));
  expect(await chat.lastMessage()).toContain('Confirmar');
  await chat.reply('Reagendar');
  await chat.chooseSecondAvailable();
  await chat.reply('Cancelar');
  expect(await api.appointmentStatus(booking.id)).toBe('cancelled');
  expect(await chat.handoffCount()).toBe(0);
});
```

- [ ] **Step 2: Confirmar falha E2E**

Run: `pnpm exec vitest run test/e2e`
Expected: FAIL até o harness conectar Chatwoot, n8n, Core e MV Mock.

- [ ] **Step 3: Completar harness e runbooks**

Documentar comandos exatos de instalação Windows/Linux, URLs, criação de credenciais, importação, atualização segura, diagnóstico, rotação, backup, restauração e rollback. O checklist de homologação exige Swagger/OpenAPI, módulos licenciados, limites, autenticação, dados autorizados, responsáveis da clínica e aprovação formal dos textos de preparo.

- [ ] **Step 4: Executar gate final em ambiente limpo**

Run: `docker compose -f infra/compose/dev.yml down; docker compose -f infra/compose/dev.yml up -d --build; pnpm lint; pnpm typecheck; pnpm test; pnpm exec vitest run test/e2e; node scripts/scan-secrets.mjs; node scripts/smoke-stack.mjs`
Expected: todos os comandos passam; jornada normal tem zero handoff; cenários `timeout`, `rate-limit` e `unauthorized` terminam em retry seguro ou handoff auditado.

- [ ] **Step 5: Commit**

```bash
git add README.md docs/runbooks test/e2e
git commit -m "docs: complete clinic automation delivery"
```

## Completion Gate

- [ ] Reexecutar `pnpm lint`, `pnpm typecheck`, `pnpm test` e E2E a partir de clone limpo.
- [ ] Confirmar que `.env`, tokens, dados pessoais e dumps não estão rastreados.
- [ ] Demonstrar orientação, agendamento, lembrete, reagendamento e cancelamento sem atendente.
- [ ] Demonstrar conflito de vaga, limite de taxa, timeout e indisponibilidade com auditoria e fallback.
- [ ] Restaurar um backup em banco isolado e comparar contagens críticas.
- [ ] Registrar versões das imagens e checksums usados na demonstração.
