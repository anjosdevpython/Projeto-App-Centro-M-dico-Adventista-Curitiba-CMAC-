# Estrutura de Diretórios — Portal CMAC

```
projeto_clinica/
├── .planning/                     # Documentação de planejamento e arquitetura GSD
│   └── codebase/                  # Documentos do mapa de engenharia
├── apps/
│   └── web/                       # Aplicação principal Next.js
│       ├── public/                # Assets públicos estáticos
│       │   ├── avatars/           # Fotos profissionais de médico e paciente
│       │   ├── favicon.ico        # Ícone de guia do navegador
│       │   ├── icon.png           # Ícone web em alta resolução
│       │   ├── logo-cmac.png      # Marca Adventist Health Brasil
│       │   └── manifest.json      # Configuração PWA instalável
│       ├── src/
│       │   ├── app/               # Rotas Next.js App Router
│       │   │   ├── agendamentos/  # Consulta de histórico e agendamentos
│       │   │   ├── agendar/       # Agendamento com bio modal e turnos
│       │   │   ├── ajuda/         # Central de ajuda e suporte
│       │   │   ├── cadastro/      # Login / alternância de perfil
│       │   │   ├── checkin/       # Recepção digital e senha C-042
│       │   │   ├── inicio/        # Dashboard principal do paciente
│       │   │   ├── laudos/        # Central de laudos e gráfico de evolução
│       │   │   ├── medico/        # Visão médica PEP e chamada
│       │   │   ├── perfil/        # Dados, documentos e dependentes
│       │   │   ├── prescricoes/   # Receituário digital e farmácia
│       │   │   ├── suporte/       # Canal de atendimento direto
│       │   │   ├── teleconsulta/  # Sala de teleatendimento com vídeo e chat
│       │   │   ├── termos/        # Assinatura digital TCLE com canvas
│       │   │   ├── globals.css    # Estilos globais e tokens macOS
│       │   │   └── layout.tsx     # Shell e metadados raiz
│       │   ├── components/        # Componentes compartilhados
│       │   │   ├── portal-shell.tsx  # Sidebar recolhível e BottomNav
│       │   │   └── register-form.tsx # Formulário de credenciamento
│       │   └── lib/               # Lógica de negócio e dados mock
│       │       └── demo/          # Serviços simulados SOUL MV
│       └── test/                  # Testes automatizados (Vitest + Axe)
├── package.json                   # Raiz do monorepo pnpm
└── pnpm-workspace.yaml            # Configuração de workspaces
```
