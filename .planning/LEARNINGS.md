# Aprendizados e Padrões de Engenharia — Portal CMAC

## 1. Decisões Arquiteturais Chave (Key Decisions)

- **Desacoplamento de Perfis (Paciente vs. Corpo Clínico):**
  - *Contexto:* Inicialmente, o protótipo mesclava telas de prontuário com autoatendimento do paciente no mesmo fluxo.
  - *Decisão:* Criada uma separação lógica e visual estrita no `PortalShell` e no sistema de credenciamento (`/cadastro`). Quando o médico está ativo, ele vê ferramentas clínicas (PEP, chamada de fila, agenda e interconsultas); quando o paciente está ativo, ele vê ferramentas de autoatendimento (agendamento, laudos, teleconsulta, receitas e check-in).
  - *Impacto:* Redução drástica da carga cognitiva e total alinhamento com a privacidade e o fluxo hospitalar.

- **Migração do Tailwind CDN para PostCSS Nativo:**
  - *Contexto:* O uso do script `cdn.tailwindcss.com` gerava alertas no console e aumentava o tempo de renderização inicial.
  - *Decisão:* Instalação de `tailwindcss`, `postcss` e `autoprefixer` com extração de arquivo CSS estático e purgação automática de classes no build Turbopack.
  - *Impacto:* Zero warnings de console, melhoria expressiva de performance e conformidade para homologação de produção.

- **Conformidade Estrita com Diretrizes da Marca (Adventist Health Brand Guidelines):**
  - *Contexto:* Havia o risco de utilizar componentes excessivamente genéricos ou que fugissem da identidade corporativa da instituição.
  - *Decisão:* Adoção dos códigos de cores institucionais (Azul Noturno `#00244a`, Azul Petróleo `#006398`, Verde Saúde `#95f8a7` e `#63743A`), tipografia *Plus Jakarta Sans* e símbolos oficiais (Cruz, Folha da Vida e número 7).
  - *Impacto:* O portal transmite a credibilidade e a serenidade necessárias para um ecossistema hospitalar de grande porte.

---

## 2. Padrões de Design e UI Reutilizáveis (Discovered Patterns)

- **Canvas Tátil Responsivo para Assinatura (TCLE / LGPD):**
  - Padrão construído com `HTML5 Canvas`, suportando tanto eventos de toque mobile (`onTouchStart`, `onTouchMove`, `onTouchEnd`) quanto mouse (`onMouseDown`, `onMouseMove`, `onMouseUp`). Converte o traço em `dataURL` com carimbo de tempo e hash SHA-256.
- **Barra Lateral Adaptativa com Persistência:**
  - Alternância fluida entre expandida (`w-64 lg:w-72`) e recolhida para ícones rápidos (`w-20`), com gravação automática do estado em `localStorage`.
- **Favicon Dinâmico e Compatibilidade Cross-Browser:**
  - No Next.js App Router, colocar `favicon.ico` e `icon.png` diretamente na pasta `src/app/` garante que navegadores Chromium priorizem o ícone da aplicação instantaneamente.

---

## 3. Surpresas e Desafios Superados (Surprises & Pitfalls)

- **Validação de Acessibilidade com Múltiplos `<main>`:**
  - *Desafio:* O auditor `jest-axe` falhou porque uma página possuía uma tag `<main>` aninhada dentro de outra tag `<main>` no `PortalShell`.
  - *Solução:* O container principal do shell foi convertido para uma `<div>` semântica (`flex-1 flex flex-col min-w-0`), garantindo que o documento mantenha exatamente um único landmark `<main>` no topo do nível de página.
- **Encoding UTF-8 em Ambientes Windows:**
  - *Desafio:* Na geração automática de metadados via scripts PowerShell, caracteres acentuados podiam ser salvos com codificação ANSI/Windows-1252.
  - *Solução:* Garantir sempre o salvamento explícito em UTF-8 sem BOM para preservar caracteres como "Médico", "Gestão" e "Clínica".

---

## 4. Recomendações para as Próximas Fases

1. **Camada de Backend Permanente:** Substituir a camada simulada em `localStorage` por APIs REST/GraphQL integradas ao prontuário real do SOUL MV.
2. **Sinalização WebRTC para Telemedicina:** Adicionar servidor de mídia para chamadas de vídeo bidirecionais criptografadas.
3. **Painel de Senhas da Recepção (Totem):** Criar a rota dedicada `/painel-tv` para televisores na sala de espera com avisos sonoros de chamada.
