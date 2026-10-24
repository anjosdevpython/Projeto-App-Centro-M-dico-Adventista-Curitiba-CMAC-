# SDD — Portal de Autoatendimento do Centro Médico Adventista Curitiba

**Documento:** Software Design Description / fonte de verdade do produto

**Instituição:** Centro Médico Adventista Curitiba (CMAC)

**Versão:** 1.0

**Atualização:** 24 de outubro de 2026

**Estado:** implementação demonstrativa em andamento

**Responsáveis-alvo:** produto, UX/UI, engenharia, segurança, operação e homologação

## 1. Finalidade

Este documento consolida a ideia do produto, requisitos, limites, arquitetura, decisões, identidade, integração, segurança, estado da implementação e caminho até produção. Ele substitui como orientação principal a proposta inicial centrada em chatbot, WhatsApp, Chatwoot e n8n.

O produto válido é um **portal web convencional de autoatendimento administrativo**, responsivo e acessível. Chatwoot, WhatsApp e n8n podem ser adotados futuramente como integrações auxiliares, mas não são o núcleo do sistema e não controlam autenticação, autorização ou consistência transacional.

## 2. Visão do produto

### 2.1 Problema

Pacientes precisam consultar informações administrativas e gerenciar agendamentos com clareza, segurança e autonomia, usando principalmente o celular. O CMAC precisa reduzir atrito operacional sem criar confirmação falsa, exposição de dados ou decisões clínicas automatizadas.

### 2.2 Proposta

Uma experiência única onde o paciente poderá:

- criar e recuperar acesso com verificação proporcional ao risco;
- consultar especialidades, profissionais, unidades e horários;
- agendar com resumo e confirmação explícita;
- consultar somente os próprios agendamentos;
- cancelar ou reagendar segundo regras configuradas;
- receber protocolo verificável das operações concluídas;
- solicitar suporte em exceções administrativas.

### 2.3 Princípios

- **Administrativo, não clínico:** não diagnosticar, prescrever, interpretar exames ou orientar tratamento.
- **Confirmação verdadeira:** uma operação só aparece como concluída após resposta conclusiva da fonte responsável.
- **Privacidade por padrão:** coletar, armazenar e expor apenas o necessário.
- **Acessível desde a base:** WCAG 2.2 AA como alvo de projeto.
- **Mobile-first sem limitar desktop:** jornadas curtas, legíveis e utilizáveis por teclado.
- **Demonstração inequívoca:** dados sintéticos e aviso persistente em todo ambiente demo.
- **Integrações por contrato:** nenhuma API, payload ou capacidade do SOUL MV será inventada.

## 3. Identidade e linguagem

- Nome institucional: **Centro Médico Adventista Curitiba**.
- Sigla: **CMAC**.
- Referência visual: manual oficial em `https://marca.adventisthealth.com.br/brand-guidelines/`.
- Cores institucionais atualmente aplicadas: azul `#1A4A7A` e ciano `#00B5CC`.
- Logotipos, fontes e demais ativos oficiais dependem de autorização institucional.
- Tom: humano, direto, sereno e inclusivo; evitar jargão técnico e promessas clínicas.

A imagem de referência do aplicativo HELP foi usada somente para compreender hierarquia mobile, cartões, contraste e organização. A marca HELP não pertence ao CMAC e não deve ser copiada.

## 4. Referência Stitch e experiência

O pacote `stitch_portal_de_autoatendimento_adventista_curitiba.zip`, fornecido pelo responsável do projeto, contém 14 telas de referência. Ele orienta composição, navegação e estados visuais, mas não substitui requisitos de segurança, acessibilidade ou regras institucionais.

Diretrizes para transformar as telas em produto:

- mapear primeiro cadastro, acesso, início, catálogo e agendamentos;
- usar cartões acionáveis com rótulos explícitos;
- exibir carregamento, vazio, sucesso, validação, conflito, indisponibilidade e recuperação;
- manter foco visível, semântica HTML, mensagens associadas aos campos e alvos de toque amplos;
- não depender somente de cor, ícone ou gesto;
- não colocar dados sensíveis em URL, cache offline ou analytics;
- tratar telas clínicas ou funcionalidades não aprovadas como evolução condicionada, não como escopo entregue.

## 5. Escopo

### 5.1 Primeira entrega

- cadastro, verificação, login, logout e recuperação;
- catálogo administrativo e disponibilidade;
- agendamento idempotente com controle de concorrência;
- consulta dos próprios agendamentos;
- cancelamento e reagendamento seguros;
- protocolo/comprovante;
- suporte para exceções;
- auditoria e métricas sanitizadas;
- modo demonstrativo sintético.

### 5.2 Evoluções condicionadas

- dependentes e atualização cadastral;
- convênio, plano e elegibilidade;
- documentos, pré-cadastro e check-in;
- pagamentos;
- preparos aprovados;
- resultados liberados pelos sistemas responsáveis;
- notificações, pesquisa de satisfação e atendimento multicanal.

### 5.3 Fora do escopo

- diagnóstico, triagem clínica, prescrição ou interpretação de sintomas/exames;
- dados reais em demonstração;
- acesso direto ao banco do SOUL MV;
- automação de telas como integração principal;
- integração produtiva sem contrato, documentação e homologação;
- confirmação local de uma operação externa incerta.

## 6. Jornadas essenciais

### 6.1 Identidade

Cadastro valida dados mínimos e posse do contato. CPF isolado nunca autentica. Sessões são revogáveis e toda leitura ou mutação verifica propriedade do recurso no servidor.

### 6.2 Agendamento

1. Selecionar especialidade, profissional, unidade e data.
2. Consultar opções normalizadas pelo backend.
3. Reservar a opção temporariamente quando a integração suportar.
4. Revisar paciente, serviço, local, data, horário e regras.
5. Confirmar explicitamente.
6. Emitir protocolo apenas após confirmação conclusiva.

Estados de domínio: `searching`, `available`, `held`, `confirming`, `confirmed`, `expired`, `conflicted`, `uncertain` e `failed`.

### 6.3 Cancelamento e reagendamento

Ambos exigem identidade, propriedade, política aplicável e confirmação explícita. O reagendamento preserva o horário original até a nova marcação estar garantida, quando a capacidade externa permitir. Operações incertas são reconciliadas antes de nova tentativa.

## 7. Arquitetura

```text
Navegador
   |
Next.js / React
   |
Fastify / TypeScript
   |---- autenticação e autorização
   |---- catálogo e agendamentos
   |---- idempotência, protocolos e auditoria
   |---- PostgreSQL / Drizzle
   |
SoulMvPort
   |---- SoulMvDemoAdapter (ativo no modo demo)
   +---- SoulMvHttpAdapter (bloqueado até homologação)
```

O monorepo pnpm contém:

- `apps/web`: interface Next.js;
- `apps/api`: domínio, rotas e adaptadores Fastify;
- `packages/contracts`: schemas Zod e tipos compartilhados;
- `infra`: composição de infraestrutura de teste;
- `docs`: especificação, plano, histórico e referências.

### 7.1 Fronteira SOUL MV

`SoulMvPort` representa capacidades necessárias sem vazar formatos proprietários para o domínio. O adaptador sintético e o futuro adaptador HTTP devem passar pela mesma suíte contratual. O adaptador real permanece desativado até o CMAC/MV fornecer:

- documentação OpenAPI/Swagger autorizada;
- URL e credenciais de homologação por canal seguro;
- método de autenticação e limites;
- módulos licenciados e operações permitidas;
- regras de retentativa, idempotência e reconciliação.

### 7.2 Ambientes

| Ambiente | Dados | Integrações | Uso |
| --- | --- | --- | --- |
| `development` | sintéticos | simuladas | desenvolvimento local |
| `demo` | sintéticos | `SoulMvDemoAdapter` | apresentação segura |
| `homologation` | autorizados | endpoints documentados | validação restrita |
| `production` | reais | homologadas | atendimento após aprovações |

O navegador não pode alterar o ambiente nem ativar o adaptador real.

## 8. Segurança, privacidade e LGPD

- Argon2id para senhas, com parâmetros versionáveis.
- Sessões e autorização verificadas no servidor.
- Cookies de produção HttpOnly, Secure e SameSite, com proteção CSRF apropriada.
- Limitação de tentativas e defesa contra enumeração.
- IDs públicos não sequenciais.
- Segredos fora do Git e nunca expostos em variáveis públicas.
- Logs, métricas e auditoria sem CPF, telefone, token ou conteúdo sensível em claro.
- Idempotência persistente nas mutações.
- Controle transacional na disputa de horários.
- Timeout, retry seguro e reconciliação de resultado incerto.
- TLS, backup verificado, restauração ensaiada e menor privilégio antes de produção.
- Retenção, base legal, direitos do titular e política de dependentes sujeitos à validação jurídica do CMAC.

## 9. Estado comprovado da implementação

Atualizado no commit-base `46a93cc` e complementado por este documento.

| Capacidade | Estado | Evidência atual |
| --- | --- | --- |
| Workspace pnpm e contratos de ambiente | Implementado | validação de ambiente e testes raiz |
| Schemas compartilhados e banco | Implementado em código | schemas Drizzle e migrações versionadas |
| Identidade e autorização | Implementado no domínio | testes de senha, verificação e isolamento |
| Catálogo SOUL MV sintético | Implementado | adaptador demo e teste contratual |
| Adaptador SOUL MV real | Intencionalmente bloqueado | falha sem configuração autorizada |
| Agendamento, concorrência e reconciliação | Implementado no backend | testes unitários/de integração em memória |
| Cancelamento e reagendamento | Implementado no backend | testes de política, idempotência e preservação |
| Shell web e cadastro | Implementado | páginas Next.js e testes de acessibilidade |
| UI completa de catálogo/agendamento | Pendente | prevista nas tarefas 8–10 do plano |
| Suporte e telemetria | Pendente | prevista na tarefa 9 |
| API composta e E2E | Pendente | prevista na tarefa 10 |
| Docker/PostgreSQL real | Não validado localmente | Docker indisponível na estação original |
| Produção | Bloqueada | depende de homologação, aprovações e hardening |

Verificação mais recente antes deste documento: 24 testes aprovados, typecheck de API e web aprovado, build Next.js aprovado e varredura básica de segredos limpa.

## 10. Critérios de aceite

- paciente A nunca acessa recursos do paciente B;
- CPF isolado não autentica;
- confirmação exige revisão explícita;
- repetição não cria agendamento duplicado;
- apenas uma solicitação vence uma disputa de horário;
- timeout não gera confirmação falsa;
- cancelamento e reagendamento respeitam política e propriedade;
- toda conclusão produz protocolo;
- jornadas principais funcionam em celular e teclado;
- ambiente demo nunca parece atendimento real;
- adaptador real não usa endpoints inventados;
- nenhuma credencial ou dado de paciente é versionado.

## 11. Dependências para homologação e produção

- autorização de logotipo, fontes e ativos da marca;
- validação institucional do catálogo, conteúdo e regras;
- definição de identidade, recuperação e dependentes;
- revisão LGPD, retenção e termos;
- documentação e credenciais de homologação SOUL MV;
- infraestrutura, domínio, TLS, backup e observabilidade;
- responsáveis por segurança, acessibilidade, operação e go-live;
- teste E2E em ambiente limpo e plano de rollback.

## 12. Roadmap imediato

1. Completar UI de catálogo, agendamento e “Meus agendamentos”.
2. Compor API e persistência em execução real.
3. Adicionar suporte, auditoria e telemetria sanitizada.
4. Criar E2E mobile/desktop e infraestrutura Docker reproduzível.
5. Escrever runbooks de instalação, backup, restauração, incidentes e rollback.
6. Homologar SOUL MV somente com documentação autorizada.
7. Realizar avaliação de segurança, acessibilidade e LGPD.
8. Executar piloto controlado e gate de produção.

## 13. Governança deste documento

- Atualize o SDD quando uma decisão alterar escopo, arquitetura, segurança, integração ou UX.
- Registre a mudança também em `docs/HISTORY.md`.
- Não transforme hipótese em fato sem indicar fonte e responsável pela validação.
- Não registre segredos, dados pessoais reais ou detalhes internos não autorizados.
- Preserve prompts operacionais em `docs/PROMPTS.md`; o SDD deve descrever decisões, não transcrever conversas.

## 14. Referências internas

- Especificação detalhada: `docs/superpowers/specs/2026-10-23-clinica-atendimento-automation-design.md`
- Plano executável: `docs/superpowers/plans/2026-10-23-clinica-atendimento-automation.md`
- Dependências: `docs/architecture/DEPENDENCIES.md`
- Histórico: `docs/HISTORY.md`
- Prompts: `docs/PROMPTS.md`
