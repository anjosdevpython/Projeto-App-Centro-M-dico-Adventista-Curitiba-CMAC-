# Portal de Autoatendimento do Centro Médico Adventista Curitiba — Design

**Data original:** 23 de outubro de 2026

**Revisão:** 24 de outubro de 2026

**Estado:** aguardando revisão final

**Fonte de verdade:** solicitação mais recente do contratante

**Instituição:** Centro Médico Adventista Curitiba (CMAC)

## 1. Decisão de produto

O produto será um web app de autoatendimento administrativo, responsivo e acessível, no qual o paciente poderá navegar sem depender de chatbot. A primeira entrega funcional cobrirá cadastro, autenticação, recuperação de acesso, consulta de catálogo e horários, agendamento, consulta dos próprios agendamentos, cancelamento, reagendamento e emissão de protocolo.

O desenho anterior, centrado em Chatwoot e n8n, deixa de ser a arquitetura principal. Chatwoot poderá apoiar atendimento humano e n8n poderá orquestrar notificações, mas nenhum deles concentrará autenticação, autorização, regras críticas ou consistência transacional.

O portal automatiza etapas administrativas elegíveis. Não substitui profissionais de saúde, não elimina exceções operacionais e não executa funções clínicas.

## 2. Evidências, requisitos e hipóteses

### 2.1 Fatos confirmados em fontes públicas

- A denominação oficial é **Centro Médico Adventista Curitiba**, sigla **CMAC**.
- O endereço publicado é Alameda Júlia da Costa, 1447, Bigorrilho, Curitiba, PR, CEP 80730-070.
- O CMAC integra a rede Adventist Health Brasil.
- A missão publicada é servir, curar e salvar, promovendo saúde física, mental, social e espiritual, seguindo o exemplo de Cristo.
- O manual possui regras para logotipos, cores, tipografia, tom de voz e aplicações; os ativos oficiais exigem autorização explícita.
- A página comercial do SOUL MV informa capacidades gerais, como central de agendamento e integração, mas não documenta APIs.

Fontes consultadas em 24 de outubro de 2026:

- https://adventisthealth.com.br/unidades/
- https://marca.adventisthealth.com.br/
- https://marca.adventisthealth.com.br/brand-guidelines/
- https://marca.adventisthealth.com.br/brand-guidelines/siglas-institucionais/
- https://marca.adventisthealth.com.br/brand-guidelines/missao-visao-e-valores/
- https://mv.com.br/solucao/soul-mv-hospitalar

### 2.2 Requisitos informados pelo contratante

- Web app convencional, mobile-first, em português brasileiro e WCAG 2.2 AA.
- Backend, persistência, validação, testes e separação entre demonstração e integração real.
- Primeira entrega com identidade, acesso, catálogo, disponibilidade e ciclo de agendamento.
- SOUL MV como fonte de verdade para os dados sob sua responsabilidade.
- Operações confirmadas apenas após resposta conclusiva do sistema responsável.
- Segurança compatível com dados pessoais sensíveis e LGPD.
- Estados de carregamento, vazio, sucesso, erro, indisponibilidade e recuperação.
- Protocolo e comprovante para operações concluídas.
- Métricas de conclusão, abandono, falha, duplicidade e encaminhamento.

### 2.3 Hipóteses que exigem validação interna

- Módulos SOUL MV contratados, documentação, autenticação, limites e homologação.
- Regras de cancelamento, reagendamento, antecedência e tolerância.
- Especialidades, profissionais, horários, convênios e documentos atuais.
- Método institucional de verificação de identidade e recuperação.
- Relações de responsabilidade e representação de dependentes.
- Conteúdo aprovado para preparos, orientações, mensagens e comprovantes.
- Provedores de comunicação, pagamentos e armazenamento de documentos.
- Política jurídica de retenção, bases legais e atendimento a titulares.
- Autorização para uso de logotipos, fontes e ativos oficiais.

Dados públicos não serão promovidos a regras operacionais sem validação do CMAC.

## 3. Escopo incremental

### 3.1 Primeira entrega funcional

- Cadastro com verificação de contato.
- Autenticação, encerramento de sessão e recuperação de acesso.
- Catálogo de especialidades, profissionais, unidades e horários.
- Agendamento com reserva temporária, resumo e confirmação explícita.
- Área “Meus agendamentos”.
- Cancelamento e reagendamento conforme regras configuradas.
- Protocolo e comprovante de cada operação confirmada.
- Suporte para exceções, falha de identidade ou indisponibilidade.
- Modo demonstrativo integralmente sintético e identificado.

### 3.2 Evoluções condicionadas

- Atualização cadastral e dependentes.
- Convênio, plano e elegibilidade.
- Pré-cadastro e envio privado de documentos.
- Preparos aprovados, check-in e acompanhamento de chegada.
- Pagamento por provedor autorizado.
- Documentos e resultados já liberados pelos sistemas responsáveis.
- Lembretes, pesquisa de satisfação e suporte.

### 3.3 Fora do escopo inicial

- Diagnóstico, prescrição, interpretação de exames ou triagem clínica.
- Integração produtiva sem contrato e documentação autorizados.
- Gravação direta no banco da MV ou automação de telas como padrão.
- Dados reais em demonstração.
- Confirmação local quando o resultado externo estiver incerto.

## 4. Experiência e identidade visual

A referência anexada orienta a hierarquia mobile, blocos arredondados, títulos diretos, atalhos em cartões e contraste alto. Ela não autoriza copiar a marca HELP nem inventar tokens da Adventist Health.

Antes do acabamento, serão extraídos do manual os tokens permitidos: cores, tipografia, espaçamento, logos, margens de proteção, tamanhos mínimos e usos sobre fundos. Ativos ainda não autorizados terão substitutos provisórios claramente marcados.

Princípios:

- mobile-first e responsividade até desktop;
- linguagem simples, alvos de toque amplos e ações inequívocas;
- navegação por teclado, foco visível e semântica HTML;
- mensagens de erro associadas e anúncios acessíveis;
- contraste e escala compatíveis com WCAG 2.2 AA;
- nenhuma jornada depende de cor, gesto ou chatbot;
- dados sensíveis não entram em cache offline.

## 5. Arquitetura

```text
Navegador/PWA
      |
Web App Next.js
      |
API Fastify/TypeScript
  |       |         |
  |       |         +--> Auditoria, métricas e suporte
  |       +------------> PostgreSQL + armazenamento privado
  |
  +--> SoulMvPort
          |--> SoulMvDemoAdapter (dados sintéticos)
          +--> SoulMvHttpAdapter (desativado até homologação)

Opcionais:
- n8n: notificações e orquestrações não transacionais
- Chatwoot: atendimento humano e exceções
```

### 5.1 Web app e backend

Next.js e TypeScript oferecerão formulários acessíveis e rotas protegidas. Fastify concentrará sessão, autorização por recurso, schemas, idempotência, regras, auditoria, protocolos e adaptação ao SOUL MV. O navegador nunca receberá segredos ou autorização implícita.

### 5.2 Persistência

PostgreSQL guardará contas, sessões revogáveis, referências opacas externas, estados de jornada, idempotência, protocolos, suporte e auditoria minimizada. Migrações serão versionadas. Dados demonstrativos serão inequivocamente sintéticos.

### 5.3 SOUL MV

`SoulMvPort` representará somente capacidades necessárias e confirmadas. O adaptador demonstrativo e o real obedecerão ao mesmo contrato. O real ficará desativado até documentação e acesso de homologação. Nenhum endpoint, payload, evento ou mecanismo de autenticação será inventado.

## 6. Identidade e acesso

O cadastro valida dados mínimos, duplicidade e abuso, confirma posse do contato e cria sessão segura. Recuperação exige fator proporcional ao risco; CPF isolado nunca autentica. Falhas incluem código expirado, excesso de tentativas, identidade divergente e indisponibilidade. A interface preserva o mínimo de contexto e oferece retomada ou suporte.

Critério central: uma identidade não acessa recursos pertencentes a outra, inclusive pela alteração manual de identificadores.

## 7. Agendamento

Estados: `searching`, `available`, `held`, `confirming`, `confirmed`, `expired`, `conflicted`, `uncertain`, `failed`.

1. Paciente escolhe especialidade, profissional, unidade e data.
2. Backend consulta o adaptador e devolve opções normalizadas.
3. A escolha cria reserva temporária quando suportado.
4. O resumo apresenta paciente, serviço, local, data, horário e regras.
5. Confirmação explícita envia mutação idempotente.
6. Somente resposta positiva gera status confirmado, protocolo e comprovante.

Se outra pessoa ocupar o horário, não há confirmação local e novas opções são exibidas. Timeout após envio produz `uncertain`; o backend consulta o estado antes de repetir. Cliques repetidos, recarregamento e reenvio não duplicam marcações.

## 8. Consulta, cancelamento e reagendamento

“Meus agendamentos” lista somente recursos autorizados. Cancelamento valida identidade, propriedade e regra, exige confirmação explícita, usa idempotência, mostra sucesso somente após confirmação externa e emite protocolo.

Reagendamento mantém o horário anterior enquanto a nova opção não estiver garantida, quando a integração permitir. A nova vaga usa reserva e controle de concorrência. Resultados incertos são reconciliados antes de qualquer repetição.

## 9. Exceções e suporte

O usuário poderá abrir e acompanhar solicitação por falha de identidade, acessibilidade, indisponibilidade, divergência, integração incerta ou pedido humano. Cada solicitação terá protocolo, estado, histórico sanitizado e correlação técnica. Se Chatwoot for adotado, receberá somente dados mínimos e resumo sem segredos.

## 10. Segurança e privacidade

- Autorização no servidor em toda leitura e mutação.
- Identificadores públicos não sequenciais.
- Cookies HttpOnly, Secure, SameSite e proteção CSRF adequada.
- Rate limiting e defesa contra enumeração.
- Senhas com algoritmo atual e parâmetros versionados.
- Segredos somente no servidor e fora do Git.
- TLS e controles de acesso no armazenamento.
- Logs sanitizados e auditoria sem dados sensíveis.
- Uploads futuros privados, limitados e validados.
- Retenção, exclusão, exportação e bases legais sujeitas a validação.
- Backups com checksum e restauração ensaiada.

Dependentes terão vínculos e permissões explícitos; não compartilharão automaticamente todos os dados do responsável.

## 11. Resiliência

- Idempotência persistida para mutações.
- Locks ou garantias transacionais para disputa de horário.
- Timeouts explícitos e retry apenas quando seguro.
- Circuit breaker para dependências degradadas.
- Reconciliação de operações incertas.
- Respostas externas validadas antes do domínio.
- Correlação ponta a ponta e estados que nunca simulam conclusão.

## 12. Testes

- Unitários para regras, schemas, permissões e estados.
- Repositórios e migrações com PostgreSQL.
- Contrato compartilhado pelos adaptadores.
- Integração para sessões, idempotência, concorrência e reconciliação.
- E2E mobile e desktop para cadastro, acesso e agendamento.
- Testes por teclado e auditorias automatizadas de acessibilidade.
- Isolamento entre pacientes, cliques repetidos, disputa, timeout e falha externa.
- Scanner de segredos, logs sanitizados, backup, restauração e rollback.

## 13. Métricas

- início, conclusão, abandono e tempo por jornada;
- buscas sem disponibilidade;
- agendamentos, cancelamentos e reagendamentos confirmados;
- duplicidades evitadas;
- operações incertas e reconciliadas;
- falhas e latência por integração;
- suporte, intervenção humana e abuso bloqueado.

Métricas não conterão identificadores pessoais ou conteúdo clínico.

## 14. Ambientes

- `development`: dados sintéticos e ferramentas locais.
- `demo`: faixa permanente “Ambiente de demonstração — nenhum atendimento real será realizado”.
- `homologation`: integrações autorizadas e acesso restrito.
- `production`: somente após aprovações técnica, institucional, jurídica e operacional.

O modo é determinado no servidor. Nenhum parâmetro do cliente transforma demonstração em operação real.

## 15. Incrementos

1. Diagnóstico, fontes, jornadas, arquitetura e tokens autorizados.
2. Portal demonstrativo com identidade, acesso e agendamento sintético.
3. Integração real em homologação, limitada às capacidades documentadas.
4. Cancelamento, reagendamento, reconciliação e recuperação homologados.
5. Evoluções de cadastro, convênio, pré-atendimento, check-in, pagamentos e documentos.
6. Hardening, acessibilidade, operação, produção e piloto controlado.

## 16. Critérios de aceite da primeira entrega

- Paciente A não acessa dados do paciente B.
- Cadastro, acesso e recuperação não usam CPF como único fator.
- Catálogo e horários sintéticos podem ser consultados.
- Agendamento exige resumo e confirmação.
- Cliques repetidos não duplicam agendamento.
- Apenas uma pessoa vence disputa pelo mesmo horário.
- Timeout não produz confirmação falsa.
- Cancelamento e reagendamento obedecem às regras configuradas.
- Toda conclusão produz protocolo verificável.
- Jornadas funcionam em celular e por teclado.
- Demonstração não pode ser confundida com atendimento real.
- Stack executa sem segredos versionados.
- Testes, migrações, contratos, implantação e rollback são documentados.

## 17. Dependências para produção

- Autorização de marca e ativos.
- Validação do catálogo e regras pelo CMAC.
- Processo de identidade e recuperação.
- Parecer de privacidade, retenção e dependentes.
- Contrato, documentação e credenciais de homologação do SOUL MV.
- Provedores de comunicação, armazenamento e pagamentos.
- Infraestrutura, domínio, TLS, monitoração, backup e responsáveis.
- Homologação de segurança, acessibilidade e jornadas.

## 18. Relatório obrigatório

Cada incremento registrará o que foi implementado e testado, o que é apenas demonstrativo, quais integrações foram realmente homologadas, dependências de produção, jornadas que exigem intervenção humana, métricas e riscos residuais.
