# Arquitetura do Sistema — Portal CMAC

## 1. Visão Geral
O projeto segue uma arquitetura moderna orientada a componentes no modelo **Next.js App Router**:

```
                         [ Vercel Edge / CDN ]
                                   │
                                   ▼
                       [ RootLayout (layout.tsx) ]
                                   │
                       [ PortalShell (Sidebar + BottomNav) ]
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
 [ Portal do Paciente ]                             [ Corpo Clínico ]
  • /inicio                                          • /medico (Agenda,
  • /agendar                                           Fila, PEP, Interconsultas)
  • /agendamentos
  • /teleconsulta
  • /prescricoes
  • /laudos
  • /termos (TCLE / LGPD)
  • /checkin
  • /perfil
```

## 2. Padrões de Design & Estado
- **Autenticação Demo Sincronizada:** Persistência em `localStorage` com alternância rápida entre Perfis de Paciente e Médico.
- **Sidecar & Desktop Navigation:** Barra lateral com estado recolhível (`w-20` vs `w-64/72`) preservado em cache local.
- **Layout Responsivo Adaptativo:** Desktop com barra lateral flutuante e mobile com Dock inferior ergonômico.
