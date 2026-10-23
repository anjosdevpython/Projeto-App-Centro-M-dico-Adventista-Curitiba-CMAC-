# Automação de Atendimento da Clínica Adventista — Design

**Data:** 23 de outubro de 2026
**Estado:** aprovado
**Escopo:** piloto implantável, executável sem credenciais externas e preparado para integração posterior com Soul MV e WhatsApp Cloud API.

## 1. Objetivo

Construir uma plataforma de atendimento administrativo automatizado para a Clínica Adventista. O piloto deve funcionar com dados sintéticos por meio do widget web do Chatwoot e simuladores das APIs externas. Quando a clínica fornecer as credenciais e os contratos reais, a ativação deverá exigir somente configuração, adequação localizada dos adaptadores e homologação, sem reescrever as jornadas.

O sistema cobrirá identificação, consulta de disponibilidade, agendamento, confirmação, cancelamento, reagendamento, instruções de preparo, lista de espera e transferência para atendimento humano.

## 2. Limites do produto

### Incluído

- Atendimento pelo widget web do Chatwoot no piloto.
- Preparação para WhatsApp Cloud API oficial.
- Jornadas administrativas automatizadas e auditáveis.
- Simulador da Soul MV com pacientes, agendas, profissionais, especialidades, procedimentos, convênios e marcações sintéticos.
- Workflows do n8n exportados em JSON e importáveis.
- Ambientes Docker de desenvolvimento e produção.
- Observabilidade, backup, documentação operacional e testes automatizados.

### Excluído

- Diagnóstico, triagem clínica, interpretação de sintomas ou aconselhamento médico.
- Integração produtiva com Soul MV antes da entrega das credenciais e especificações contratadas.
- Uso de gateways não oficiais do WhatsApp.
- Armazenamento de dados clínicos reais no ambiente de demonstração.
- Biometria facial, faturamento TISS, prescrição digital e recepção física nesta primeira versão. Esses itens permanecem como extensões futuras.

## 3. Princípios

1. **Segurança clínica:** automação restrita a tarefas administrativas.
2. **Determinismo nas ações:** IA pode classificar intenção e extrair campos, mas não executa operações sem validação explícita.
3. **Integrações substituíveis:** n8n nunca depende diretamente do formato proprietário da Soul MV.
4. **Privacidade por padrão:** dados mínimos, retenção configurável e logs sanitizados.
5. **Operação humana preservada:** qualquer paciente pode solicitar atendente; exceções seguem para uma fila humana com contexto.
6. **Paridade entre mock e produção:** simuladores e adaptadores reais obedecem aos mesmos contratos internos.

## 4. Arquitetura

```text
Widget web ─┐
WhatsApp ───┼─> Chatwoot ─> n8n ─> Integration Core ─┬─> Soul MV Mock
Humano ─────┘                                         ├─> Soul MV Adapter
                                                      └─> WhatsApp Adapter
                              │
                              ├─> PostgreSQL
                              ├─> Redis
                              └─> métricas, logs e auditoria
```

### 4.1 Chatwoot

Responsável por inbox, contatos, histórico conversacional, supervisão e transferência entre automação e atendentes. O piloto utiliza o widget web. A caixa de entrada oficial do WhatsApp será ativada quando a clínica fornecer Meta Business, número, token e identificadores.

### 4.2 n8n

Responsável pela orquestração temporal e conversacional. Seus workflows chamam apenas a API interna do Integration Core. Regras de domínio, autenticação externa e normalização de dados não ficam embutidas nos nós.

Workflows previstos:

1. Entrada de eventos do Chatwoot e deduplicação.
2. Classificação de intenção e roteamento.
3. Identificação/cadastro administrativo do paciente.
4. Busca e reserva de disponibilidade.
5. Confirmação de agendamento.
6. Cancelamento e reagendamento.
7. Lembretes D-2 e D-1.
8. Orientações de preparo por procedimento.
9. Lista de espera e preenchimento de vagas.
10. Transferência para atendimento humano.
11. Tratamento de falhas e reprocessamento.
12. Rotinas agendadas, auditoria e KPIs.

Cada workflow terá JSON importável, documentação de variáveis, identificadores estáveis, timeout, tratamento explícito de erro e caminho de fallback.

### 4.3 Integration Core

Serviço TypeScript que oferece uma API REST interna, valida requisições e concentra:

- contratos versionados;
- validação de entrada e saída;
- regras administrativas;
- idempotência;
- controle de concorrência de reservas;
- autenticação entre serviços;
- rate limiting, retry com backoff e circuit breaker;
- consentimento e retenção;
- auditoria e logs sanitizados;
- adaptadores para sistemas externos.

O serviço será modular, separando pacientes, catálogo, agendas, marcações, notificações, consentimentos e auditoria.

### 4.4 Adaptadores e simuladores

O `SoulMvPort` define as operações necessárias sem pressupor os endpoints reais:

- localizar/criar referência administrativa de paciente;
- listar unidades, especialidades, profissionais e procedimentos;
- consultar disponibilidade;
- criar, confirmar, cancelar e reagendar marcação;
- consultar preparo administrativo de procedimento;
- verificar situação administrativa de convênio quando o contrato real permitir.

`SoulMvMockAdapter` implementa essas operações com dados sintéticos. `SoulMvHttpAdapter` permanece protegido por feature flag e só será ativado após homologação. Testes de contrato devem ser executados contra ambos.

O adaptador de WhatsApp segue a mesma estratégia: um mock para desenvolvimento e uma implementação oficial da Cloud API ativada posteriormente.

## 5. Jornadas

### 5.1 Entrada e identificação

O Chatwoot envia o evento ao n8n. O evento é deduplicado, a intenção é classificada e o paciente recebe aviso de privacidade. Para operações que alteram agenda, o fluxo coleta e valida os identificadores administrativos mínimos. Falhas ou ambiguidade encaminham para humano.

### 5.2 Agendamento

O paciente escolhe unidade, especialidade/procedimento e preferências. O Integration Core consulta opções e devolve uma lista normalizada. A opção selecionada recebe uma reserva temporária; a confirmação cria a marcação de forma idempotente. Concorrência ou expiração produzem novas opções, nunca duplicação.

### 5.3 Cancelamento e reagendamento

O sistema confirma a identidade e a marcação antes da mudança. Cancelamentos liberam a vaga e disparam o fluxo da lista de espera. Reagendamento só cancela a marcação anterior depois que a nova reserva estiver confirmada ou conforme a capacidade transacional oferecida pela API real.

### 5.4 Lembretes e preparo

Rotinas agendadas selecionam marcações elegíveis em D-2 e D-1. Mensagens utilizam conteúdo versionado por procedimento e registram entrega, resposta e confirmação. Conteúdo clínico de preparo só poderá entrar em produção após validação e aprovação formal da clínica.

### 5.5 Lista de espera

Uma vaga liberada seleciona candidatos elegíveis por critérios configuráveis. A oferta tem prazo e lock; apenas a primeira aceitação válida conclui a marcação. Os demais candidatos recebem encerramento neutro.

### 5.6 Transferência humana

O fluxo cria/atribui a conversa no Chatwoot e inclui resumo estruturado, intenção, dados já validados, etapa atual e erro, sem exigir que o paciente repita informações. O handoff ocorre por solicitação, baixa confiança, indisponibilidade externa, exceção de regra ou tema clínico.

## 6. Modelo de dados

O PostgreSQL armazenará somente dados necessários à automação:

- referências de contato e consentimento;
- correlação entre conversa, paciente e marcação;
- estado das jornadas;
- chaves de idempotência e reservas;
- fila de espera;
- catálogo sintético/configurável de preparo;
- eventos de auditoria;
- entregas de notificações.

Dados externos serão referenciados por identificadores opacos quando possível. Redis suportará locks, cache curto, rate limiting e filas técnicas; não será fonte permanente de verdade.

## 7. Segurança e LGPD

- Segredos fornecidos apenas por variáveis/arquivos externos não versionados.
- TLS no acesso externo e autenticação entre componentes.
- Privilégio mínimo em bancos, Chatwoot, n8n e adaptadores.
- Logs estruturados com mascaramento de CPF, telefone, tokens e conteúdo sensível.
- Trilha de auditoria imutável no nível da aplicação para ações administrativas.
- Política configurável de retenção e anonimização.
- Exportação e exclusão atendidas por procedimento documentado.
- Dados integralmente sintéticos no piloto.
- Backups criptografados e restauração testada.
- Documentação de resposta a incidentes e rotação de credenciais.

## 8. IA e segurança conversacional

A primeira versão usa abordagem híbrida. Regras e menus cobrem caminhos críticos; um classificador pode reconhecer intenções e extrair campos de texto livre. A saída deve obedecer esquema estrito, possuir limiar de confiança e nunca autorizar diretamente uma operação.

Temas clínicos, sintomas, urgência, automutilação ou risco à vida não são processados como atendimento administrativo. A conversa recebe mensagem segura previamente aprovada e é encaminhada ao canal humano ou de emergência definido pela clínica.

O sistema deve operar sem provedor de IA: nesse modo, menus determinísticos permanecem funcionais.

## 9. Resiliência e erros

- Idempotência para eventos, mensagens e alterações de agenda.
- Retentativas apenas em falhas transitórias, com backoff exponencial e jitter.
- Circuit breaker para dependências externas.
- Dead-letter/reprocessamento manual para falhas definitivas.
- Locks com expiração para disputa por vaga.
- Timeouts explícitos e limites de taxa configuráveis.
- Fallback humano quando a continuidade automatizada não for segura.
- Healthchecks de processo, dependências e prontidão.

## 10. Observabilidade

Métricas mínimas:

- volume e conclusão por jornada;
- taxa de transferência humana;
- erros por integração e endpoint;
- latência por operação;
- duplicações evitadas;
- agendamentos, cancelamentos e reagendamentos;
- confirmações e respostas a lembretes;
- vagas preenchidas por lista de espera;
- disponibilidade dos componentes.

Logs terão correlação por jornada, conversa e requisição, sem expor dados sensíveis. Dashboards e alertas distinguirão falha técnica de exceção de negócio.

## 11. Ambientes e implantação

O repositório conterá Docker Compose para:

- **desenvolvimento/piloto:** execução local, dados sintéticos e mocks ativos;
- **produção:** imagens fixadas, proxy TLS, volumes persistentes, backups, healthchecks e adaptadores condicionados por flags.

Serviços previstos: Chatwoot, n8n, Integration Core, Soul MV Mock, PostgreSQL, Redis, reverse proxy e stack de observabilidade. A topologia poderá ser instalada primeiro em notebook/servidor de demonstração e depois em Linux fornecido pela clínica.

## 12. Estratégia de testes

- Testes unitários das regras e validações.
- Testes de contrato para portas e adaptadores.
- Testes de integração com PostgreSQL e Redis.
- Validação estrutural e execução automatizada dos workflows n8n.
- Testes ponta a ponta das principais jornadas via Chatwoot e mocks.
- Testes de concorrência para reserva e lista de espera.
- Testes de falhas, retry, circuit breaker e reprocessamento.
- Verificações de segurança, vazamento de segredo e sanitização de logs.
- Ensaio documentado de backup e restauração.

## 13. Ativação das APIs reais

Quando as credenciais forem recebidas:

1. Obter contratos OpenAPI/Swagger, ambientes e módulos licenciados.
2. Mapear endpoints reais para `SoulMvPort` e registrar lacunas.
3. Configurar autenticação e limites no cofre/ambiente de homologação.
4. Implementar ajustes somente em `SoulMvHttpAdapter`.
5. Executar testes de contrato e jornadas com dados autorizados.
6. Validar conteúdo e regras com responsáveis da clínica.
7. Realizar piloto controlado, observar métricas e aprovar produção.
8. Repetir o processo para WhatsApp Cloud API.

## 14. Critérios de aceite do piloto

- Todo o stack sobe por procedimento documentado e healthchecks ficam saudáveis.
- O widget web inicia e conclui as jornadas administrativas principais.
- JSONs do n8n são importáveis e não contêm credenciais.
- Soul MV Mock permite demonstrar sucesso, conflito e falha externa.
- Repetição de eventos não cria mensagens ou marcações duplicadas.
- Transferência humana preserva o contexto no Chatwoot.
- Logs e auditoria permitem reconstruir uma jornada sem revelar dados protegidos.
- Testes automatizados passam em ambiente limpo.
- Documentação descreve instalação, operação, backup, incidentes e ativação das APIs reais.

## 15. Entregáveis

- código-fonte do Integration Core e simuladores;
- configurações Docker;
- workflows n8n em JSON;
- configuração documentada do Chatwoot;
- esquemas e migrações do banco;
- contratos internos e exemplos de payload;
- suíte de testes;
- dashboards e alertas básicos;
- runbooks de instalação, operação, backup, incidentes e homologação;
- checklist final para implantação na clínica.
