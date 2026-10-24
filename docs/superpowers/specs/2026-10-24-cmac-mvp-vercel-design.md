# CMAC Demonstration MVP for Vercel — Design

**Date:** 24 October 2026

**Status:** Approved direction; implementation pending

**Parent specification:** `docs/SDD.md`

## 1. Goal

Deliver a separate, deployable branch that the project owner can open on a phone or desktop and use to demonstrate the proposed CMAC patient experience. The MVP must feel coherent and interactive while remaining unmistakably synthetic and disconnected from real care delivery.

Success means a stakeholder can complete a simulated appointment journey, review the result under “Meus agendamentos”, reschedule it, cancel it, and understand the intended visual and operational direction without requiring a backend, database, SOUL MV access, or credentials.

## 2. Chosen approach

The MVP will be a client-side Next.js demonstration application inside `apps/web`. It will use a typed synthetic catalog and browser-local persistence for demonstration state. The Vercel deployment will build only the web workspace.

This approach is preferred over:

- a static visual showcase, because stakeholders need to experience the journey;
- a temporary cloud database and serverless API, because they add security, cost, latency, and operational failure modes without validating the core presentation goal.

The production-oriented backend remains in the repository but is not called by the MVP. Its contracts and safety requirements continue to define the future integrated product.

## 3. Audience and presentation scenario

Primary audience:

- CMAC leadership and operational representatives;
- product and UX reviewers;
- technical and integration stakeholders.

Expected presentation:

1. Open a Vercel preview URL.
2. Explain that all people, schedules and appointments are synthetic.
3. Enter the portal using a one-step demonstration access screen.
4. Search or browse services.
5. Select a professional and time.
6. Review and confirm the simulated appointment.
7. Open “Meus agendamentos”.
8. Reschedule and cancel, showing feedback and protocol-like receipts.

## 4. MVP scope

### 4.1 Pages

- `/`: institutional landing and demonstration entry.
- `/cadastro`: existing accessible registration form, adapted to enter the demo after validation.
- `/inicio`: patient dashboard with greeting, next appointment, shortcuts and institutional context.
- `/agendar`: progressive appointment flow.
- `/agendamentos`: current and historical synthetic appointments.
- `/agendamentos/[id]`: detail, reschedule and cancellation flow.
- `/ajuda`: demonstration limitations and contact guidance.

### 4.2 Demonstration capabilities

- browse specialties and professionals;
- filter synthetic slots by date;
- review a complete appointment summary;
- confirm exactly once per user action;
- persist appointments in `localStorage` for the current browser;
- display a generated demonstration protocol;
- reschedule without losing the original until the replacement is selected;
- cancel with explicit confirmation;
- reset all synthetic demonstration data;
- display useful empty and recovery states.

### 4.3 Out of scope

- real authentication or patient identity;
- real patient, schedule or appointment data;
- SOUL MV calls;
- database persistence or cross-device state;
- messages, payments, documents, results or clinical guidance;
- production domain, production deployment or institutional go-live;
- analytics that collect personal information.

## 5. Experience design

The interface will preserve the CMAC visual direction already established in the repository: institutional blue and cyan, calm neutral surfaces, generous rounding, direct titles and mobile-first action cards. It may learn hierarchy from the supplied Stitch screens and HELP reference, but it must not copy the HELP brand or unapproved Adventist assets.

Every page displays the persistent message:

> Ambiente de demonstração — nenhum atendimento real será realizado.

The dashboard prioritizes three actions: agendar, view appointments and get help. The appointment flow uses short steps with a visible progress indicator:

1. specialty;
2. professional;
3. date and time;
4. review;
5. confirmation.

The user can return to a previous step without losing non-sensitive choices. Success states include the simulated protocol and a clear route to “Meus agendamentos”.

## 6. Components and boundaries

### 6.1 Demo domain

`src/lib/demo/` owns synthetic records, types, protocol generation and browser storage. It exposes a small service interface so UI components do not call `localStorage` directly.

Expected types:

- `DemoSpecialty`;
- `DemoProfessional`;
- `DemoSlot`;
- `DemoAppointment`;
- `DemoAppointmentStatus`.

### 6.2 UI features

- `features/demo-access`: demonstration entry and reset;
- `features/catalog`: specialty/professional/slot selection;
- `features/booking`: wizard and review;
- `features/appointments`: cards, detail and state transitions.

Route files remain composition layers. Business-like state transitions live in the demo service and are independently tested.

### 6.3 Navigation

The shell provides desktop and mobile navigation to Início, Agendar, Agendamentos and Ajuda. Active state must use text and shape, not color alone.

## 7. State and error handling

Browser storage is treated as an unreliable convenience:

- read failures fall back to deterministic seed data;
- malformed data is discarded without exposing an exception;
- write failures keep the current screen usable and explain that the action cannot be preserved;
- client-only state renders after hydration to avoid server/client mismatch;
- destructive actions require explicit confirmation;
- repeated confirmation does not duplicate an appointment.

All demonstration protocols are clearly labeled and are not valid service receipts.

## 8. Accessibility and responsive requirements

- target WCAG 2.2 AA for the covered journey;
- semantic headings, landmarks and buttons;
- keyboard-operable wizard, dialogs and navigation;
- visible focus and minimum practical touch targets;
- field and action errors announced through accessible status regions;
- reduced-motion preference respected;
- layout verified at narrow mobile and desktop widths;
- no critical meaning conveyed by color alone.

## 9. Vercel delivery design

The GitHub branch will be `codex/mvp-vercel`. The recommended Vercel configuration is:

- framework preset: Next.js;
- root directory: `apps/web`;
- install command: `cd ../.. && pnpm install --frozen-lockfile`;
- build command: `pnpm build`;
- output: Next.js default;
- Node.js: a version compatible with the repository engine range.

No environment secrets are required. A root `vercel.json` may be added only if local verification shows it improves reliable monorepo detection; dashboard configuration remains documented either way.

The branch is intended for a Vercel preview deployment. Production promotion requires an explicit later decision.

## 10. Testing and acceptance

Automated tests must prove:

- the synthetic catalog renders;
- the wizard advances and reviews the selected data;
- double confirmation produces one appointment;
- appointments survive a service re-instantiation through browser storage;
- rescheduling replaces the slot safely;
- cancellation requires confirmation and changes status;
- empty and malformed-storage states recover;
- the primary shell has no automated axe violations.

Release gate:

- `pnpm test` passes;
- API and web typechecks pass;
- the web production build passes from the repository and from the documented Vercel root;
- no secret or real patient data is tracked;
- links and primary mobile journey are manually exercised;
- branch is pushed without changing `codex/cmac-portal`.

## 11. Documentation changes

- add an MVP run section to `README.md`;
- add an MVP deployment guide under `docs/runbooks/`;
- record the branch and design decision in `docs/HISTORY.md`;
- preserve `docs/SDD.md` as the product source of truth and label this MVP as a demonstration delivery profile.
