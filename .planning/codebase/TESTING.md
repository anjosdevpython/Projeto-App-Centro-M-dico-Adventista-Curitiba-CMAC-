# Estratégia de Testes — Portal CMAC

## 1. Ferramental de Teste
- **Runner:** Vitest 5.0.5
- **Renderizador:** `@testing-library/react`
- **Ambiente:** `jsdom`
- **Auditoria de Acessibilidade:** `axe-core` via `jest-axe`

## 2. Cobertura de Testes Atual
1. `test/demo-flow.test.tsx` (3 testes):
   - Inicialização da sessão de demonstração.
   - Agendamento de consulta integrado ao SOUL MV.
   - Listagem e recuperação de consultas agendadas.

2. `test/auth-pages.test.tsx` (4 testes):
   - Alternância de abas entre Paciente e Médico.
   - Emissão de credenciais de paciente.
   - Emissão de credenciais de médico (CRM-PR).

3. `test/accessibility.test.tsx` (2 testes):
   - Verificação de 0 violações de acessibilidade no `PortalShell`.
   - Verificação de 0 violações de acessibilidade no formulário de credenciamento.

## 3. Execução
```bash
# Executar todos os testes
pnpm test

# Verificação estática de tipos
pnpm typecheck

# Build de produção otimizado
pnpm build
```
