# Prompt de execução do Portal CMAC

Use este prompt em uma nova conversa aberta na raiz do repositório. Não inclua credenciais no chat.

## INÍCIO DO PROMPT

Continue a implementação do Portal de Autoatendimento do **Centro Médico Adventista Curitiba (CMAC)** sem depender do histórico de conversas anteriores.

Leia integralmente, nesta ordem:

1. `README.md`
2. `docs/SDD.md`
3. `docs/HISTORY.md`
4. `docs/PROMPTS.md`
5. `docs/superpowers/specs/2026-10-23-clinica-atendimento-automation-design.md`
6. `docs/superpowers/plans/2026-10-23-clinica-atendimento-automation.md`
7. estado do repositório, histórico Git, código e testes.

O produto válido é um portal web convencional, mobile-first e acessível. A arquitetura anterior centrada em WhatsApp, Chatwoot e n8n foi substituída; esses serviços são opcionais e não controlam regras críticas.

Use o manual oficial da Adventist Health como orientação de marca e o pacote de telas do Google Stitch como referência visual. Não copie a marca HELP, não invente ativos institucionais e não amplie o escopo apenas porque uma tela existe.

Trabalhe somente com dados sintéticos em `development` e `demo`. Não invente endpoints, payloads ou capacidades do SOUL MV. O adaptador real permanece desativado até receber documentação e acesso autorizado de homologação. Nunca armazene credenciais ou dados pessoais no Git, documentação, logs ou screenshots.

Execute a próxima tarefa incompleta do plano com testes. Preserve autorização por recurso, idempotência, controle de concorrência, reconciliação de incerteza, acessibilidade WCAG 2.2 AA e aviso persistente de demonstração. Não implemente diagnóstico, prescrição, triagem ou interpretação clínica.

Antes de concluir, execute testes, typecheck, build e varredura de segredos. Atualize `docs/SDD.md` e `docs/HISTORY.md` se houver decisão relevante. Relate separadamente: implementado, demonstrativo, pendente, dependências externas e riscos.

## FIM DO PROMPT

## Insumos necessários para homologação

- documentação e credenciais do SOUL MV por canal seguro;
- módulos e endpoints autorizados, limites e contatos técnicos;
- regras institucionais de agenda, identidade, recuperação e dependentes;
- textos e catálogo validados pelo CMAC;
- autorização de logotipo, fontes e ativos oficiais;
- decisões LGPD, retenção e responsáveis;
- infraestrutura, domínio, TLS, backup e observabilidade.
