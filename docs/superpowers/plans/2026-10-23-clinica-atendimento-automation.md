# CMAC Patient Self-Service Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver an executable, mobile-first patient portal for Centro Médico Adventista Curitiba (CMAC) that demonstrates secure identity, appointment discovery, booking, cancellation, rescheduling, protocols, and support with synthetic data.

**Architecture:** A pnpm monorepo contains a Next.js web app and a Fastify API. PostgreSQL persists accounts, sessions, journeys, idempotency records, appointments, protocols, support requests, and audit events; a typed `SoulMvPort` isolates a synthetic adapter from a future authorized HTTP adapter. Critical rules remain in the API, while n8n and Chatwoot are optional adapters for later notifications and human support.

**Tech Stack:** Node.js 22 LTS, pnpm 10, TypeScript strict mode, Next.js App Router, React, Fastify, Zod, Drizzle ORM, PostgreSQL 16, Argon2id, Vitest, Testing Library, Playwright, axe-core, Docker Compose, OpenTelemetry-compatible structured telemetry.

**Spec:** `docs/superpowers/specs/2026-10-23-clinica-atendimento-automation-design.md`

## Global Constraints

- Use the institutional name **Centro Médico Adventista Curitiba (CMAC)**.
- The conventional web interface must complete every normal first-release journey without a chatbot.
- All demonstration data is synthetic and every demo screen displays “Ambiente de demonstração — nenhum atendimento real será realizado”.
- Never invent SOUL MV endpoints, credentials, schemas, events, or licensed capabilities.
- The real SOUL MV adapter remains disabled until authorized documentation and homologation access exist.
- CPF alone never authenticates a patient.
- The API authorizes every patient-owned read and mutation.
- Never report booking, cancellation, or rescheduling as complete without conclusive confirmation from the active source-of-truth adapter.
- Every external mutation is idempotent and every uncertain result is reconciled before retry.
- Sensitive data is never placed in offline caches, logs, metrics, URLs, analytics payloads, or client-readable environment variables.
- The main mobile and keyboard journeys target WCAG 2.2 AA.
- Verify stable dependency releases before lockfile creation; record the chosen versions in `docs/architecture/DEPENDENCIES.md`.
- Use test-first red/green/refactor for production behavior.

## File Map

```text
apps/
  api/
    src/app.ts                         Fastify composition root
    src/config.ts                      validated server configuration
    src/auth/                          accounts, sessions, verification and authorization
    src/catalog/                       catalog use cases and HTTP routes
    src/appointments/                  holds, booking, cancellation and rescheduling
    src/protocols/                     immutable operation receipts
    src/support/                       patient-visible exception requests
    src/audit/                         sanitized audit events
    src/integrations/soul-mv/          port, demo adapter and disabled HTTP adapter
    src/db/                            Drizzle schema, migrations and repositories
    test/                              API unit, integration and contract tests
  web/
    src/app/                           public and authenticated App Router routes
    src/components/                    shared accessible interface primitives
    src/features/                      auth, catalog, booking, appointments and support
    src/lib/api/                       typed browser-to-API client
    test/                              component and accessibility tests
packages/
  contracts/                           shared Zod schemas and transport types
test/e2e/                              Playwright user journeys
infra/compose/                         development and test stacks
docs/architecture/                     decisions, sources and dependency record
docs/runbooks/                         install, operate, backup, rollback and homologate
```

---

### Task 1: Executable Workspace and Environment Contract

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `.editorconfig`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `scripts/validate-env.mjs`
- Create: `test/validate-env.test.ts`
- Create: `docs/architecture/DEPENDENCIES.md`

**Interfaces:**
- Produces: root commands `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build`; `validateEnv(input): AppEnvironment`.

- [ ] **Step 1: Verify supported releases and write the dependency record**

Run `node --version`, `corepack pnpm --version`, and package-registry queries for the planned libraries. Record exact selected versions, official support links, consultation date, and rationale in `docs/architecture/DEPENDENCIES.md`. Keep Node on the supported 22 LTS line.

- [ ] **Step 2: Write the failing environment test**

```ts
it('accepts an explicit demo environment and rejects a real adapter without credentials', () => {
  expect(validateEnv({
    APP_ENV: 'demo',
    DATABASE_URL: 'postgres://clinic:clinic@localhost:5432/clinic',
    SESSION_SECRET: '0123456789abcdef0123456789abcdef',
    SOUL_MV_ADAPTER: 'demo',
  }).appEnv).toBe('demo');

  expect(() => validateEnv({
    APP_ENV: 'homologation',
    DATABASE_URL: 'postgres://clinic:clinic@localhost:5432/clinic',
    SESSION_SECRET: '0123456789abcdef0123456789abcdef',
    SOUL_MV_ADAPTER: 'http',
  })).toThrow(/SOUL_MV_BASE_URL/);
});
```

- [ ] **Step 3: Run the test and observe the expected failure**

Run: `corepack pnpm exec vitest run test/validate-env.test.ts`
Expected: FAIL because `scripts/validate-env.mjs` does not exist.

- [ ] **Step 4: Create the minimal workspace and validator**

Define explicit schemas for `APP_ENV=development|demo|homologation|production`, `SOUL_MV_ADAPTER=demo|http`, database URL, session secret, public origins, and conditional HTTP-adapter settings. Root scripts must fail when a workspace script fails.

- [ ] **Step 5: Verify the workspace**

Run: `pnpm test && pnpm lint && pnpm typecheck`
Expected: all configured checks exit 0 and the environment test passes.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json .editorconfig .gitignore .env.example scripts test docs/architecture/DEPENDENCIES.md
git commit -m "chore: create CMAC portal workspace"
```

### Task 2: Shared Contracts, Database, and Demo Boundary

**Files:**
- Create: `packages/contracts/package.json`
- Create: `packages/contracts/src/environment.ts`
- Create: `packages/contracts/src/catalog.ts`
- Create: `packages/contracts/src/appointments.ts`
- Create: `packages/contracts/src/protocols.ts`
- Create: `apps/api/package.json`
- Create: `apps/api/src/config.ts`
- Create: `apps/api/src/db/schema.ts`
- Create: `apps/api/src/db/client.ts`
- Create: `apps/api/drizzle.config.ts`
- Create: `apps/api/test/schema.test.ts`
- Create: `infra/compose/test.yml`

**Interfaces:**
- Consumes: `validateEnv(input): AppEnvironment`.
- Produces: Zod schemas `CatalogItemSchema`, `SlotSchema`, `AppointmentSchema`, `OperationProtocolSchema`; database tables for accounts, sessions, idempotency, appointments, protocols, support requests, and audit events.

- [ ] **Step 1: Write the failing contract and schema tests**

```ts
it('rejects a confirmed appointment without an external confirmation reference', () => {
  expect(() => AppointmentSchema.parse({
    id: crypto.randomUUID(),
    patientId: crypto.randomUUID(),
    slotId: 'slot-1',
    status: 'confirmed',
  })).toThrow();
});

it('keeps idempotency keys unique per patient and operation', async () => {
  await insertIdempotency({ patientId: patientA, operation: 'book', key: 'same' });
  await expect(insertIdempotency({ patientId: patientA, operation: 'book', key: 'same' }))
    .rejects.toThrow();
});
```

- [ ] **Step 2: Run the tests and observe failure**

Run: `pnpm --filter @cmac/api test -- schema.test.ts`
Expected: FAIL because contracts and database schema do not exist.

- [ ] **Step 3: Implement contracts and migrations**

Use discriminated unions so `confirmed` requires `externalReference` and `confirmedAt`; `uncertain` requires `correlationId`. Add foreign keys, timestamps, revocation fields, unique idempotency indexes, and patient ownership indexes. Store only opaque integration references.

- [ ] **Step 4: Run migration and tests against PostgreSQL**

Run: `docker compose -f infra/compose/test.yml up -d postgres && pnpm --filter @cmac/api db:migrate && pnpm --filter @cmac/api test -- schema.test.ts`
Expected: migration succeeds and tests pass.

- [ ] **Step 5: Commit**

```bash
git add packages/contracts apps/api infra/compose/test.yml
git commit -m "feat: add contracts and persistence foundation"
```

### Task 3: Secure Account, Session, and Recovery Flows

**Files:**
- Create: `apps/api/src/auth/password.ts`
- Create: `apps/api/src/auth/service.ts`
- Create: `apps/api/src/auth/repository.ts`
- Create: `apps/api/src/auth/routes.ts`
- Create: `apps/api/src/auth/verification-port.ts`
- Create: `apps/api/src/auth/demo-verification-adapter.ts`
- Create: `apps/api/src/auth/authorize-patient.ts`
- Create: `apps/api/test/auth.test.ts`
- Create: `apps/api/test/authorization.test.ts`

**Interfaces:**
- Produces: `AuthService.register`, `verifyContact`, `signIn`, `signOut`, `startRecovery`, `completeRecovery`; `requirePatient(request): PatientPrincipal`.

- [ ] **Step 1: Write failing isolation and recovery tests**

```ts
it('does not authenticate with CPF alone', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/v1/auth/sign-in',
    payload: { cpf: '52998224725' },
  });
  expect(response.statusCode).toBe(400);
});

it('denies patient A access to patient B resources', async () => {
  const response = await asPatient(patientA).get(`/v1/patients/${patientB.id}/profile`);
  expect(response.statusCode).toBe(403);
});
```

- [ ] **Step 2: Run tests and observe failure**

Run: `pnpm --filter @cmac/api test -- auth.test.ts authorization.test.ts`
Expected: FAIL because authentication routes and authorization guard do not exist.

- [ ] **Step 3: Implement minimal secure identity flow**

Hash passwords with Argon2id using recorded parameters. Store only hashed one-time verification codes, enforce expiry and attempt limits, rotate the session identifier after sign-in, persist revocable sessions, and set `HttpOnly`, `Secure` outside local development, and `SameSite=Lax` cookies. Return neutral recovery responses to prevent account enumeration.

- [ ] **Step 4: Verify auth and abuse controls**

Run: `pnpm --filter @cmac/api test -- auth.test.ts authorization.test.ts`
Expected: registration, verification, sign-in, sign-out, recovery, expiry, attempt limits, session rotation, and cross-patient denial pass.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/auth apps/api/test/auth.test.ts apps/api/test/authorization.test.ts
git commit -m "feat: add secure patient identity"
```

### Task 4: SOUL MV Port, Synthetic Catalog, and Contract Tests

**Files:**
- Create: `apps/api/src/integrations/soul-mv/port.ts`
- Create: `apps/api/src/integrations/soul-mv/demo-adapter.ts`
- Create: `apps/api/src/integrations/soul-mv/http-adapter.ts`
- Create: `apps/api/src/integrations/soul-mv/select-adapter.ts`
- Create: `apps/api/src/catalog/service.ts`
- Create: `apps/api/src/catalog/routes.ts`
- Create: `apps/api/test/soul-mv-contract.ts`
- Create: `apps/api/test/catalog.test.ts`
- Create: `apps/api/fixtures/demo-catalog.ts`

**Interfaces:**
- Produces: `SoulMvPort.listSpecialties`, `listProfessionals`, `listLocations`, `listSlots`, `holdSlot`, `confirmBooking`, `getOperationStatus`, `cancelAppointment`, `rescheduleAppointment`; public read-only catalog routes.

- [ ] **Step 1: Write the failing shared adapter contract**

```ts
export function soulMvContract(createAdapter: () => SoulMvPort) {
  it('returns only schema-valid synthetic slots in demo mode', async () => {
    const slots = await createAdapter().listSlots({ specialtyId: 'cardiology' });
    expect(slots.length).toBeGreaterThan(0);
    slots.forEach(slot => expect(SlotSchema.parse(slot).isSynthetic).toBe(true));
  });
}
```

- [ ] **Step 2: Run and observe failure**

Run: `pnpm --filter @cmac/api test -- soul-mv-contract.ts catalog.test.ts`
Expected: FAIL because `SoulMvPort` and the adapters do not exist.

- [ ] **Step 3: Implement the port and demo adapter**

Use deterministic synthetic specialties, professionals, the CMAC display name, and fictional schedules. Validate all adapter outputs through shared schemas. The HTTP adapter constructor must throw `RealAdapterUnavailableError` unless homologation configuration is complete; it contains no guessed paths or payloads.

- [ ] **Step 4: Verify demo labeling and HTTP-adapter lockout**

Run: `pnpm --filter @cmac/api test -- soul-mv-contract.ts catalog.test.ts`
Expected: catalog results are synthetic and valid; an incomplete real-adapter configuration cannot start.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/integrations apps/api/src/catalog apps/api/test apps/api/fixtures
git commit -m "feat: add synthetic SOUL MV boundary"
```

### Task 5: Idempotent Booking, Concurrency, and Reconciliation

**Files:**
- Create: `apps/api/src/appointments/service.ts`
- Create: `apps/api/src/appointments/repository.ts`
- Create: `apps/api/src/appointments/routes.ts`
- Create: `apps/api/src/appointments/idempotency.ts`
- Create: `apps/api/src/protocols/service.ts`
- Create: `apps/api/src/audit/service.ts`
- Create: `apps/api/test/booking.test.ts`
- Create: `apps/api/test/booking-concurrency.test.ts`
- Create: `apps/api/test/reconciliation.test.ts`

**Interfaces:**
- Consumes: `SoulMvPort`, `requirePatient`, shared appointment schemas.
- Produces: `AppointmentService.hold`, `book`, `getOwnAppointments`, `reconcile`; routes `POST /v1/appointment-holds`, `POST /v1/appointments`, `GET /v1/appointments`.

- [ ] **Step 1: Write failing repeated-click and concurrency tests**

```ts
it('returns the same confirmed booking for repeated idempotency keys', async () => {
  const first = await service.book(patient, request, 'book-123');
  const repeated = await service.book(patient, request, 'book-123');
  expect(repeated.appointment.id).toBe(first.appointment.id);
  expect(adapter.confirmBookingCalls).toBe(1);
});

it('allows only one patient to confirm the same slot', async () => {
  const results = await Promise.allSettled(
    patients.map((patient, index) => service.book(patient, request, `book-${index}`)),
  );
  expect(results.filter(result => result.status === 'fulfilled')).toHaveLength(1);
});
```

- [ ] **Step 2: Run and observe failure**

Run: `pnpm --filter @cmac/api test -- booking.test.ts booking-concurrency.test.ts reconciliation.test.ts`
Expected: FAIL because booking services do not exist.

- [ ] **Step 3: Implement transactional booking**

Persist the idempotency record before invoking the adapter, serialize claims for the same slot with a database advisory lock or unique claim, and produce a protocol only after external confirmation. On timeout after mutation, save `uncertain`; call `getOperationStatus(correlationId)` before any retry. Sanitize audit metadata.

- [ ] **Step 4: Verify success, conflict, timeout, and reconciliation**

Run: `pnpm --filter @cmac/api test -- booking.test.ts booking-concurrency.test.ts reconciliation.test.ts`
Expected: one external mutation per idempotency key, one winner per slot, no false timeout confirmation, and a reconciled result with the original correlation ID.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/appointments apps/api/src/protocols apps/api/src/audit apps/api/test
git commit -m "feat: implement safe appointment booking"
```

### Task 6: Cancellation and Safe Rescheduling

**Files:**
- Modify: `apps/api/src/appointments/service.ts`
- Modify: `apps/api/src/appointments/routes.ts`
- Create: `apps/api/src/appointments/policy.ts`
- Create: `apps/api/test/cancellation.test.ts`
- Create: `apps/api/test/rescheduling.test.ts`

**Interfaces:**
- Produces: `AppointmentService.cancel`, `reschedule`; routes `POST /v1/appointments/:id/cancel`, `POST /v1/appointments/:id/reschedule`.

- [ ] **Step 1: Write failing ownership and preservation tests**

```ts
it('does not cancel an appointment owned by another patient', async () => {
  await expect(service.cancel(patientA, patientBAppointment.id, 'cancel-1'))
    .rejects.toMatchObject({ code: 'FORBIDDEN' });
});

it('preserves the original appointment when the replacement slot fails', async () => {
  adapter.failNextRescheduleWithConflict();
  await expect(service.reschedule(patient, original.id, newSlot.id, 'move-1')).rejects.toThrow();
  expect((await repository.get(original.id))?.status).toBe('confirmed');
});
```

- [ ] **Step 2: Run and observe failure**

Run: `pnpm --filter @cmac/api test -- cancellation.test.ts rescheduling.test.ts`
Expected: FAIL because policy, cancellation, and rescheduling behavior do not exist.

- [ ] **Step 3: Implement configurable policy and mutations**

Model rules as server-side configuration with an explicit “institutional validation pending” demo policy. Recheck ownership and state inside the transaction. Create protocols only after confirmation. Use adapter-supported atomic rescheduling when available; otherwise hold and confirm the replacement before canceling the original, and record compensation requirements on partial failure.

- [ ] **Step 4: Verify policy, idempotency, preservation, and uncertainty**

Run: `pnpm --filter @cmac/api test -- cancellation.test.ts rescheduling.test.ts`
Expected: unauthorized access is denied, repeated mutations deduplicate, policy violations explain the reason, and the original booking survives replacement failure.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/appointments apps/api/test/cancellation.test.ts apps/api/test/rescheduling.test.ts
git commit -m "feat: add safe appointment management"
```

### Task 7: Accessible Web Shell and Authentication Experience

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/app/globals.css`
- Create: `apps/web/src/app/(public)/entrar/page.tsx`
- Create: `apps/web/src/app/(public)/cadastro/page.tsx`
- Create: `apps/web/src/app/(public)/recuperar-acesso/page.tsx`
- Create: `apps/web/src/app/(portal)/layout.tsx`
- Create: `apps/web/src/components/demo-banner.tsx`
- Create: `apps/web/src/components/form-field.tsx`
- Create: `apps/web/src/components/status-message.tsx`
- Create: `apps/web/src/lib/api/client.ts`
- Create: `apps/web/test/auth-pages.test.tsx`
- Create: `apps/web/test/accessibility.test.tsx`

**Interfaces:**
- Consumes: auth API and environment mode.
- Produces: accessible portal shell, sign-in, registration, verification, recovery, session-expired recovery, and persistent demo banner.

- [ ] **Step 1: Write failing accessible interaction tests**

```tsx
it('focuses the error summary and links errors to fields', async () => {
  render(<RegisterPage />);
  await user.click(screen.getByRole('button', { name: /criar acesso/i }));
  const summary = await screen.findByRole('alert');
  expect(summary).toHaveFocus();
  expect(screen.getByLabelText(/e-mail/i)).toHaveAccessibleDescription();
});
```

- [ ] **Step 2: Run and observe failure**

Run: `pnpm --filter @cmac/web test -- auth-pages.test.tsx accessibility.test.tsx`
Expected: FAIL because the web app and components do not exist.

- [ ] **Step 3: Implement the branded shell and auth states**

Extract only verified brand tokens into CSS custom properties and record their manual URLs in comments. Use a replaceable text lockup until asset authorization is documented. Follow the attached reference’s compact mobile hierarchy and rounded action cards without copying HELP assets. Implement loading, validation, server error, unavailable, success, and expired-session states.

- [ ] **Step 4: Verify components and production build**

Run: `pnpm --filter @cmac/web test && pnpm --filter @cmac/web build`
Expected: interaction and axe checks pass, and the production build exits 0.

- [ ] **Step 5: Commit**

```bash
git add apps/web
git commit -m "feat: add accessible CMAC patient shell"
```

### Task 8: Catalog, Booking Wizard, and Patient Appointments UI

**Files:**
- Create: `apps/web/src/app/(portal)/inicio/page.tsx`
- Create: `apps/web/src/app/(portal)/agendar/page.tsx`
- Create: `apps/web/src/app/(portal)/agendamentos/page.tsx`
- Create: `apps/web/src/app/(portal)/agendamentos/[id]/page.tsx`
- Create: `apps/web/src/features/catalog/catalog-browser.tsx`
- Create: `apps/web/src/features/booking/booking-wizard.tsx`
- Create: `apps/web/src/features/booking/confirmation-summary.tsx`
- Create: `apps/web/src/features/appointments/appointment-card.tsx`
- Create: `apps/web/src/features/appointments/protocol-receipt.tsx`
- Create: `apps/web/test/booking-wizard.test.tsx`
- Create: `apps/web/test/appointments.test.tsx`

**Interfaces:**
- Consumes: catalog, booking, cancellation, rescheduling, and protocol APIs.
- Produces: end-to-end browser UI for search, explicit confirmation, receipt, own appointments, cancellation, and rescheduling.

- [ ] **Step 1: Write failing wizard and double-submit tests**

```tsx
it('shows a complete summary and disables confirmation while submitting', async () => {
  render(<BookingWizard api={api} />);
  await chooseSpecialtyProfessionalLocationAndSlot(user);
  expect(screen.getByRole('heading', { name: /revise seu agendamento/i })).toBeVisible();
  const confirm = screen.getByRole('button', { name: /confirmar agendamento/i });
  await user.dblClick(confirm);
  expect(api.book).toHaveBeenCalledTimes(1);
  expect(confirm).toBeDisabled();
});
```

- [ ] **Step 2: Run and observe failure**

Run: `pnpm --filter @cmac/web test -- booking-wizard.test.tsx appointments.test.tsx`
Expected: FAIL because booking and appointments UI do not exist.

- [ ] **Step 3: Implement all interface states**

Use short, backtrackable steps; preserve non-sensitive selections across recoverable errors; generate one idempotency key per user intent; and distinguish conflict, expired hold, uncertain result, integration outage, empty availability, and confirmed protocol. Require modal or dedicated-page confirmation for cancellation and rescheduling.

- [ ] **Step 4: Verify mobile, keyboard, and error behavior**

Run: `pnpm --filter @cmac/web test -- booking-wizard.test.tsx appointments.test.tsx accessibility.test.tsx`
Expected: all state tests and axe checks pass without console errors.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app apps/web/src/features apps/web/test
git commit -m "feat: add patient scheduling experience"
```

### Task 9: Traceable Support and Operational Telemetry

**Files:**
- Create: `apps/api/src/support/service.ts`
- Create: `apps/api/src/support/routes.ts`
- Create: `apps/api/src/telemetry/metrics.ts`
- Create: `apps/api/src/telemetry/logger.ts`
- Create: `apps/api/test/support.test.ts`
- Create: `apps/api/test/log-sanitization.test.ts`
- Create: `apps/web/src/app/(portal)/suporte/page.tsx`
- Create: `apps/web/src/features/support/support-request.tsx`
- Create: `apps/web/test/support.test.tsx`

**Interfaces:**
- Produces: `SupportService.open`, `listOwn`, `getOwn`; patient support routes; metrics for journey, abandonment, integration errors, deduplication, reconciliation, and handoff.

- [ ] **Step 1: Write failing ownership and sanitization tests**

```ts
it('does not expose another patient support request', async () => {
  const response = await asPatient(patientA).get(`/v1/support/${patientBRequest.id}`);
  expect(response.statusCode).toBe(404);
});

it('redacts sensitive values from structured logs', () => {
  logger.info({ cpf: '52998224725', email: 'patient@example.test', token: 'secret' }, 'event');
  expect(sink.output()).not.toMatch(/52998224725|patient@example\.test|secret/);
});
```

- [ ] **Step 2: Run and observe failure**

Run: `pnpm --filter @cmac/api test -- support.test.ts log-sanitization.test.ts && pnpm --filter @cmac/web test -- support.test.tsx`
Expected: FAIL because support and sanitized telemetry do not exist.

- [ ] **Step 3: Implement patient-visible support and safe metrics**

Generate non-sequential protocols, expose only patient-owned requests, and retain a sanitized status history. Measure counters and histograms with low-cardinality labels. Do not use patient IDs, contact values, free text, appointment IDs, or correlation IDs as metric labels.

- [ ] **Step 4: Verify support and telemetry**

Run: `pnpm --filter @cmac/api test -- support.test.ts log-sanitization.test.ts && pnpm --filter @cmac/web test -- support.test.tsx`
Expected: ownership, state history, protocol, redaction, and metric-label tests pass.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/support apps/api/src/telemetry apps/api/test apps/web/src/app apps/web/src/features/support apps/web/test/support.test.tsx
git commit -m "feat: add traceable patient support"
```

### Task 10: Full-Stack Composition and End-to-End Acceptance

**Files:**
- Create: `apps/api/src/app.ts`
- Create: `apps/api/src/server.ts`
- Create: `apps/api/Dockerfile`
- Create: `apps/web/Dockerfile`
- Create: `infra/compose/dev.yml`
- Create: `playwright.config.ts`
- Create: `test/e2e/auth.spec.ts`
- Create: `test/e2e/booking.spec.ts`
- Create: `test/e2e/isolation.spec.ts`
- Create: `test/e2e/failures.spec.ts`

**Interfaces:**
- Consumes: all API and web modules.
- Produces: a reproducible demo stack and executable acceptance suite.

- [ ] **Step 1: Write failing E2E acceptance tests**

```ts
test('patient registers, books, reschedules and cancels with protocols', async ({ page }) => {
  await registerSyntheticPatient(page);
  await bookFirstAvailableCardiologySlot(page);
  await expect(page.getByText(/agendamento confirmado/i)).toBeVisible();
  await rescheduleToNextAvailableSlot(page);
  await cancelCurrentAppointment(page);
  await expect(page.getByText(/protocolo/i)).toBeVisible();
});
```

- [ ] **Step 2: Run and observe failure**

Run: `pnpm exec playwright test test/e2e`
Expected: FAIL because the composed stack is not running.

- [ ] **Step 3: Compose web, API, and PostgreSQL**

Add health and readiness endpoints, migration startup, fixed non-secret demo configuration, service health checks, and isolated named volumes. Publish only required local ports. Seed synthetic data deterministically and show the demo banner on every page.

- [ ] **Step 4: Run complete E2E acceptance**

Run: `docker compose -f infra/compose/dev.yml up -d --build && pnpm exec playwright test test/e2e`
Expected: registration, recovery, booking, repeated click, cross-patient denial, slot conflict, timeout, reconciliation, cancellation, rescheduling, keyboard navigation, and mobile viewport scenarios pass.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/app.ts apps/api/src/server.ts apps/api/Dockerfile apps/web/Dockerfile infra/compose/dev.yml playwright.config.ts test/e2e
git commit -m "test: prove CMAC portal journeys end to end"
```

### Task 11: Operations, Research Record, and Production Readiness

**Files:**
- Create: `README.md`
- Create: `docs/architecture/SOURCES.md`
- Create: `docs/architecture/DECISIONS.md`
- Create: `docs/contracts/SOUL-MV-PORT.md`
- Create: `docs/journeys/FIRST-RELEASE.md`
- Create: `docs/runbooks/INSTALL.md`
- Create: `docs/runbooks/OPERATIONS.md`
- Create: `docs/runbooks/BACKUP-RESTORE.md`
- Create: `docs/runbooks/ROLLBACK.md`
- Create: `docs/runbooks/SOUL-MV-HOMOLOGATION.md`
- Create: `docs/runbooks/PRODUCTION-GATE.md`
- Create: `scripts/backup.ps1`
- Create: `scripts/restore.ps1`
- Create: `scripts/scan-secrets.mjs`
- Create: `test/operations.test.ts`

**Interfaces:**
- Produces: documented facts/requirements/hypotheses, journey rules and acceptance criteria, setup, operations, backup, rollback, and an exact homologation checklist.

- [ ] **Step 1: Write failing operational artifact tests**

```ts
it('documents every production dependency and keeps real integration disabled', () => {
  const gate = read('docs/runbooks/PRODUCTION-GATE.md');
  expect(gate).toContain('autorização dos ativos de marca');
  expect(gate).toContain('documentação autorizada do SOUL MV');
  expect(read('.env.example')).toContain('SOUL_MV_ADAPTER=demo');
});
```

- [ ] **Step 2: Run and observe failure**

Run: `pnpm exec vitest run test/operations.test.ts`
Expected: FAIL because the operational artifacts do not exist.

- [ ] **Step 3: Write runbooks and safe backup scripts**

Document exact Windows and Linux commands, environment ownership, migration and rollback rules, incident handling, retention decisions requiring approval, and the distinction between demo and real integration. Backup uses `pg_dump --format=custom`, SHA-256 checksum, and a caller-supplied output directory. Restore requires an explicit non-default target database and verifies the checksum before writing.

- [ ] **Step 4: Exercise backup, restore, and secret scanning**

Run: `pwsh scripts/backup.ps1 -OutputDirectory .artifacts/backups && pwsh scripts/restore.ps1 -BackupFile .artifacts/backups/latest.dump -TargetDatabase cmac_restore_test && node scripts/scan-secrets.mjs && pnpm exec vitest run test/operations.test.ts`
Expected: checksum validates, restore targets only `cmac_restore_test`, no secrets are detected, and tests pass.

- [ ] **Step 5: Commit**

```bash
git add README.md docs scripts test/operations.test.ts
git commit -m "docs: add CMAC portal operations and homologation"
```

### Task 12: Final Clean-Room Verification

**Files:**
- Modify: `README.md`
- Create: `docs/runbooks/DELIVERY-REPORT.md`

**Interfaces:**
- Produces: current evidence for release status, demonstration-only behavior, real integrations, blockers, human exceptions, versions, and residual risks.

- [ ] **Step 1: Reset the demo stack without deleting unrelated user data**

Run: `docker compose -f infra/compose/dev.yml down --volumes`
Expected: only volumes declared by the CMAC development compose project are removed.

- [ ] **Step 2: Run the complete clean-room gate**

Run: `docker compose -f infra/compose/dev.yml up -d --build && pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm exec playwright test test/e2e && node scripts/scan-secrets.mjs`
Expected: every command exits 0 with no test failures, type errors, lint errors, build errors, accessibility violations in covered pages, or detected secrets.

- [ ] **Step 3: Verify requirements against evidence**

Record test counts, service health, selected versions, local demo URLs, adapter mode, backup/restore evidence, known limitations, and every remaining production dependency in `docs/runbooks/DELIVERY-REPORT.md`. Explicitly list journeys that still require human intervention.

- [ ] **Step 4: Confirm repository hygiene**

Run: `git status --short && git ls-files | rg '(\.env$|\.dump$|\.bak$|secret|token)'`
Expected: only the intended delivery report and README changes are uncommitted; no environment files, database dumps, tokens, or credentials are tracked.

- [ ] **Step 5: Commit**

```bash
git add README.md docs/runbooks/DELIVERY-REPORT.md
git commit -m "docs: record verified CMAC portal delivery"
```

## Completion Gate

- [ ] Identity, recovery, catalog, booking, own appointments, cancellation, rescheduling, protocol, and support work through the conventional web interface.
- [ ] Patient isolation, idempotency, slot concurrency, timeout behavior, and reconciliation are proven by automated tests.
- [ ] Main journeys pass mobile viewport, keyboard, and automated accessibility checks.
- [ ] Demo and real modes cannot be confused or switched from the browser.
- [ ] The real SOUL MV adapter contains no guessed endpoint and remains disabled without authorized configuration.
- [ ] Logs and metrics contain no tested sensitive values.
- [ ] A clean Docker environment starts successfully and passes unit, integration, build, and E2E gates.
- [ ] Backup and isolated restore are exercised.
- [ ] The delivery report distinguishes demonstration behavior, real integrations, production blockers, and human exceptions.
