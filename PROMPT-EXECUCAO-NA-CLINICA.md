# Prompt de execução na Clínica Adventista

Copie somente o conteúdo entre `INÍCIO DO PROMPT` e `FIM DO PROMPT` para uma nova conversa do Codex aberta na raiz deste repositório.

---

## INÍCIO DO PROMPT

Você está na raiz do projeto de automação de atendimento da Clínica Adventista. Sua missão é implementar, configurar, testar e documentar o piloto completo até deixá-lo demonstrável e pronto para homologação, sem depender do histórico de nenhuma conversa anterior.

### Fontes de verdade

Leia integralmente, nesta ordem:

1. `docs/superpowers/specs/2026-10-23-clinica-atendimento-automation-design.md`
2. `docs/superpowers/plans/2026-10-23-clinica-atendimento-automation.md`
3. O estado atual do repositório, incluindo `git status`, histórico recente e arquivos existentes.

A especificação define o produto. O plano define a sequência de implementação. Se houver divergência, preserve os limites clínicos e de segurança da especificação e registre a decisão no diário de execução.

### Resultado obrigatório

Entregue uma plataforma em Docker que automatize, sem atendente no caminho normal:

- orientação administrativa sobre tipos de consulta, especialidades, profissionais, unidades, convênios, documentos, exames e procedimentos;
- identificação administrativa do paciente;
- consulta de disponibilidade;
- agendamento, confirmação, cancelamento e reagendamento;
- lembretes configuráveis em D-7, D-2, D-1 e no dia;
- orientações de preparo aprovadas pela clínica;
- lista de espera e preenchimento automático de vagas;
- pesquisa e comunicação pós-atendimento;
- histórico, supervisão e contingência humana pelo Chatwoot.

O atendimento humano é contingência para solicitação do paciente, assunto clínico, baixa confiança, indisponibilidade externa ou exceção operacional. A jornada administrativa normal deve terminar sem intervenção humana.

### Limites clínicos

Mantenha o sistema estritamente administrativo. Classifique intenção e pesquise somente conteúdo aprovado. Encaminhe temas clínicos para o canal definido pela clínica. Ações de agenda são determinísticas, validadas, idempotentes e auditáveis. O sistema não diagnostica, interpreta sintomas, escolhe tratamento nem recomenda medicamentos.

### Credenciais e dados

Antes de configurar integrações reais, verifique localmente a disponibilidade de:

- URL de homologação e documentação OpenAPI/Swagger da Soul MV;
- método de autenticação, chave/token, módulos licenciados e limites de taxa;
- conta Meta Business, `phone_number_id`, token e webhook da WhatsApp Cloud API;
- URL e token administrativo do Chatwoot;
- domínio, certificados e servidor Linux destinados ao piloto.

Solicite ao operador somente os itens ausentes que bloquearem a etapa atual. Oriente o operador a inserir segredos em `.env` local ou no cofre adotado; nunca peça que cole segredos no chat. Não grave credenciais em Git, JSONs do n8n, logs, screenshots ou documentação.

Use dados sintéticos até receber autorização formal para dados de homologação. Nunca copie dados produtivos para o piloto.

### Estratégia de integração

- Chatwoot é a interface de canais, histórico, supervisão e handoff.
- n8n orquestra jornadas; importe os workflows JSON versionados no repositório.
- O Integration Core em TypeScript concentra contratos, validação, idempotência, auditoria, regras e adaptadores.
- n8n chama somente a API interna; não espalhe payloads proprietários da Soul MV pelos workflows.
- `SoulMvMockAdapter` e `SoulMvHttpAdapter` implementam a mesma porta e passam pela mesma suíte contratual.
- Mantenha o mock disponível para demonstração e testes de falha mesmo após ativar a API real.
- Use somente WhatsApp Cloud API oficial; mantenha o widget web funcional como canal de contingência.

### Processo de execução

1. Verifique se existe uma worktree isolada; crie uma antes de alterar código quando estiver na branch principal.
2. Faça o preflight: Git, Node.js 22+, pnpm 10, Docker Engine/Desktop com Compose, portas, memória, disco, DNS e acesso às APIs.
3. Rode os testes existentes e registre a linha de base. Falhas preexistentes devem ser explicadas antes da implementação.
4. Execute as tarefas do plano em ordem, usando TDD: teste vermelho, implementação mínima, teste verde e refatoração.
5. Faça um commit convencional por tarefa. Preserve arquivos do usuário e não reescreva histórico.
6. Após cada tarefa, rode os testes direcionados, lint e typecheck relevantes.
7. Ao integrar a Soul MV real, mapeie o contrato recebido para `SoulMvPort`; alterações ficam no adaptador. Registre endpoints, campos, limites e diferenças em `docs/runbooks/SOUL-MV-HOMOLOGATION.md` sem incluir segredos.
8. Ao ativar WhatsApp, configure webhook, verificação, templates aprovados e eventos de entrega. Registre o procedimento em `docs/runbooks/WHATSAPP-ACTIVATION.md`.
9. Valide conteúdos de consultas e preparos com um responsável nomeado da clínica antes de produção; registre aprovador, data e versão.
10. Execute o gate final em ambiente limpo e gere evidências objetivas.

### Cenários obrigatórios de teste

Comprove pelo menos:

- orientação administrativa seguida de agendamento completo;
- confirmação pelo lembrete;
- reagendamento preservando a marcação anterior quando a nova vaga falhar;
- cancelamento interrompendo mensagens futuras;
- vaga cancelada oferecida à lista de espera com apenas um vencedor;
- repetição do mesmo webhook sem duplicar mensagem ou marcação;
- timeout, HTTP 401, HTTP 429, conflito de vaga e indisponibilidade externa;
- pedido explícito de atendente com resumo sanitizado no Chatwoot;
- assunto clínico encaminhado sem resposta diagnóstica;
- backup com checksum e restauração em banco isolado;
- logs sem CPF, telefone, token ou conteúdo sensível em claro.

### Gate de conclusão

Considere o trabalho concluído somente quando:

- `pnpm lint`, `pnpm typecheck`, testes unitários, integração, contratos e E2E passarem;
- `docker compose` subir todo o stack a partir de ambiente limpo e todos os healthchecks ficarem saudáveis;
- os JSONs do n8n forem importados sem erro e não contiverem credenciais;
- a jornada normal completa tiver zero handoff humano;
- os cenários de falha terminarem em retry seguro, reprocessamento ou handoff auditado;
- backup e restauração tiverem sido ensaiados;
- instalação, operação, incidentes, homologação Soul MV, ativação WhatsApp e go-live estiverem documentados;
- `git status` estiver limpo e cada tarefa possuir commit verificável.

### Relatório final

Ao terminar, informe de forma objetiva:

- o que foi implementado;
- versões e serviços ativos;
- testes executados e resultados;
- URLs locais de demonstração;
- credenciais ou aprovações ainda ausentes, sem revelar segredos;
- riscos residuais;
- checklist exato para homologação e produção.

Não encerre após apenas criar scaffolding ou exemplos. Continue até o gate de conclusão ou até encontrar um bloqueio externo real. Quando houver bloqueio, preserve o restante funcional, descreva a evidência e peça somente a informação ou ação indispensável.

## FIM DO PROMPT

---

## Antes de executar na empresa

Leve esta pasta completa. Solicite à clínica/MV, por canal seguro:

- documentação e credenciais do ambiente de homologação Soul MV;
- relação dos módulos contratados e endpoints liberados;
- limites de requisição e contatos técnicos;
- acesso Meta Business e WhatsApp Cloud API;
- servidor Linux ou autorização para Docker Desktop no equipamento de homologação;
- domínio/subdomínios e certificados;
- textos oficiais de consultas, documentos exigidos e preparos;
- responsável pela aprovação clínica, LGPD e go-live.

Não coloque chaves, tokens, CPFs ou dados de pacientes dentro deste arquivo.
