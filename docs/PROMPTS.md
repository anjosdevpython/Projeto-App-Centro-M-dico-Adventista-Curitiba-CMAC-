# Prompts e continuidade do projeto

Este arquivo mantém prompts reutilizáveis e o contexto necessário para continuar o desenvolvimento sem depender do histórico de uma conversa. Ele não armazena credenciais nem transcrições com dados pessoais.

## Hierarquia de instruções

1. Solicitação mais recente do responsável pelo projeto.
2. `docs/SDD.md`.
3. Especificação detalhada em `docs/superpowers/specs/`.
4. Plano executável em `docs/superpowers/plans/`.
5. Estado atual do código, testes e histórico Git.

## Prompt mestre para continuar a implementação

```text
Atue como uma equipe sênior de produto, UX/UI, engenharia de software,
segurança e integrações. Continue o Portal de Autoatendimento do Centro
Médico Adventista Curitiba (CMAC) a partir do estado real do repositório.

Leia integralmente, nesta ordem:
1. README.md
2. docs/SDD.md
3. docs/HISTORY.md
4. docs/superpowers/specs/2026-10-23-clinica-atendimento-automation-design.md
5. docs/superpowers/plans/2026-10-23-clinica-atendimento-automation.md
6. git status, git log recente, código e testes.

O produto é um portal web convencional, mobile-first e acessível. Não
retorne à proposta centrada em chatbot. Use o manual oficial da Adventist
Health como orientação de marca e as telas do Stitch como referência de UI,
sem copiar a marca HELP nem transformar telas em requisitos não aprovados.

Trabalhe somente com dados sintéticos. Não invente endpoints ou contratos do
SOUL MV. Mantenha o adaptador real desativado até haver documentação e acesso
autorizados de homologação. Nunca grave segredos ou dados pessoais no Git.

Implemente a próxima tarefa incompleta do plano com testes. Preserve segurança,
autorização por recurso, idempotência, acessibilidade e distinção explícita do
modo demo. Ao final, execute testes, typecheck, build e varredura de segredos;
registre o estado real, limitações e dependências externas.
```

## Prompt para incorporar telas do Stitch

```text
Compare as telas exportadas do Google Stitch com docs/SDD.md. Extraia padrões
de layout e componentes, mas mantenha os fluxos e limites definidos no SDD.
Implemente estados de carregamento, vazio, erro, conflito, indisponibilidade e
sucesso. Garanta WCAG 2.2 AA, teclado, foco, mensagens associadas e alvos de
toque adequados. Use somente ativos de marca autorizados e preserve o aviso de
ambiente demonstrativo em todas as telas.
```

## Prompt para homologação SOUL MV

```text
Antes de alterar o SoulMvHttpAdapter, confirme que documentação OpenAPI/Swagger,
URL de homologação, autenticação, módulos licenciados e limites foram fornecidos
por canal autorizado. Mapeie apenas operações documentadas para SoulMvPort.
Execute a mesma suíte contratual do adaptador demo, valide respostas externas,
trate timeout e 401/429, e reconcilie operações incertas. Não inclua segredos,
payloads sensíveis ou dados de pacientes em documentação, logs ou commits.
```

## Prompts históricos substituídos

A proposta anterior usava Chatwoot, n8n e WhatsApp como núcleo. Ela foi substituída em 24 de outubro de 2026 pela direção web-first. Esses serviços só podem voltar como integrações opcionais de atendimento ou notificação, mediante decisão explícita e atualização do SDD.

O arquivo `PROMPT-EXECUCAO-NA-CLINICA.md` permanece como prompt operacional curto e aponta para esta fonte de verdade.
