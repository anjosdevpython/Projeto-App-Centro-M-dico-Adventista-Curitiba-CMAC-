# Stack Tecnológico — Portal CMAC

## 1. Core Frameworks & Runtime
- **Next.js:** 16.4.3 (App Router com Turbopack ativado)
- **React:** 19.0.0
- **TypeScript:** 5.8.2 (Strict mode, target ES2022)
- **Node.js:** v24.21.0
- **Package Manager:** PNPM (Monorepo workspaces)

## 2. Frontend & Styling
- **Tailwind CSS:** CDN dinâmico + classes utilitárias compiladas
- **Design Tokens:** Design System *Serenidade Clínica Digital* / *Adventist Health Brand Guidelines*
  - Azul Noturno Profundo: `#00244a`
  - Azul Petróleo: `#006398`
  - Verde Musgo / Vida: `#95f8a7` e `#63743A`
  - Superfície Clínica: `#f8f9ff`
- **Tipografia:** Google Fonts — *Plus Jakarta Sans* e *Material Symbols Outlined*

## 3. Testes & Qualidade
- **Vitest:** 5.0.5 (Configuração JSDOM para componentes React)
- **Testing Library:** `@testing-library/react` 16.2.0, `@testing-library/jest-dom` 6.6.3
- **Acessibilidade:** `jest-axe` 9.0.0 (WCAG 2.1 AA / Section 508)
- **Typechecking:** `tsc --noEmit`

## 4. Hospedagem & Deploy
- **Cloud Provider:** Vercel Production
- **Domínio Ativo:** `https://centromedicoadventista.vercel.app`
- **Repositório Git:** GitHub (`anjosdevpython/Projeto-App-Centro-M-dico-Adventista-Curitiba-CMAC-`)
