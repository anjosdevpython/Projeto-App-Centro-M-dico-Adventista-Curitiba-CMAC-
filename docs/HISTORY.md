# Histórico e decisões do projeto CMAC

Este registro resume a evolução relevante do produto. O histórico completo e auditável permanece no Git.

## 23 de outubro de 2026 — proposta inicial

- O projeto começou como automação administrativa multicanal.
- WhatsApp, Chatwoot e n8n apareciam como elementos centrais.
- Foram definidos limites clínicos, segurança, idempotência e integração futura com SOUL MV.
- Um prompt de execução presencial foi criado para continuar o trabalho na clínica.

## 24 de outubro de 2026 — mudança para web-first

- O responsável confirmou o nome oficial **Centro Médico Adventista Curitiba (CMAC)**.
- A solicitação mais recente substituiu a direção anterior.
- O produto passou a ser um portal web convencional, mobile-first, sem depender de chatbot.
- Chatwoot, WhatsApp e n8n tornaram-se integrações opcionais e posteriores.
- O manual oficial da Adventist Health passou a orientar identidade e linguagem.
- A imagem HELP foi mantida apenas como referência de organização visual.
- As 14 telas exportadas do Google Stitch foram adotadas como referência de UI, sujeitas aos requisitos do produto.

## Implementação realizada

| Commit | Decisão/entrega |
| --- | --- |
| `0f88650` | redesenho do produto como portal web CMAC |
| `d83f4d4` | substituição do plano pelo fluxo web-first |
| `0d4c79e` | workspace pnpm executável |
| `78acc6c` | contratos e persistência |
| `deb08b0` | identidade segura |
| `3107eb7` | fronteira sintética SOUL MV |
| `0d735cc` | agendamento seguro |
| `5bd4c43` | cancelamento e reagendamento |
| `10d33ff` | shell acessível CMAC |
| `46a93cc` | execução correta das suítes de teste |

## Decisões vigentes

1. `docs/SDD.md` é a fonte de verdade consolidada.
2. O portal permanece em modo demonstrativo até homologação formal.
3. O SOUL MV será integrado somente por documentação e credenciais autorizadas.
4. Dados de demonstração são sempre sintéticos.
5. Segurança, propriedade do recurso, idempotência e confirmação externa são regras de domínio, não detalhes de interface.
6. Telas do Stitch não ampliam automaticamente o escopo funcional.
7. Nenhuma capacidade clínica será inferida ou automatizada.

## Como registrar mudanças futuras

Inclua data, decisão, motivo, impacto, responsável/aprovador e links para issue, PR ou commit. Nunca registre tokens, credenciais ou dados pessoais.
