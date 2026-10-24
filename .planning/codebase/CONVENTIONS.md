# Convenções de Código — Portal CMAC

## 1. Nomenclatura e Arquitetura de Arquivos
- Páginas no padrão Next.js: `src/app/[rota]/page.tsx`
- Componentes com exportação nomeada e interfaces TypeScript estritas no topo do arquivo.
- Diretivas `'use client';` explicitadas em todas as páginas com estado interativo (`useState`, `useEffect`, `useRef`).

## 2. Acessibilidade (a11y)
- Manter semântica HTML estrita (`<header>`, `<aside>`, `<nav>`, `<main>`, `<button type="button">`).
- Proibição de tags aninhadas duplicadas do mesmo landmark (ex: proibir `<main>` aninhado em `<main>`).
- Tags descritivas `aria-label` em botões de ícone sem texto visível.
- Contraste visual mínimo de 4.5:1 em elementos de leitura e foco.

## 3. Gestão de Estado
- Não utilizar bibliotecas pesadas de estado global desnecessárias; preferir hooks React (`useState`, `useEffect`) integrados ao armazenamento em `localStorage` para persistência entre sessões.
