import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { PortalShell } from '../components/portal-shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portal de Atendimento Digital | Clínica Adventista de Curitiba',
  description: 'Autoatendimento institucional e gestão de consultas da Clínica Adventista de Curitiba.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#00244a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const tailwindConfigJson = JSON.stringify({
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'surface-tint': '#355f97',
        primary: '#00244a',
        'outline-variant': '#c3c6d1',
        'tertiary-fixed-dim': '#79db8d',
        'on-error': '#ffffff',
        'tertiary-fixed': '#95f8a7',
        'surface-container-highest': '#d5e3fc',
        surface: '#f8f9ff',
        'inverse-surface': '#233144',
        'on-tertiary': '#ffffff',
        'on-secondary': '#ffffff',
        'on-error-container': '#93000a',
        tertiary: '#002b0f',
        'error-container': '#ffdad6',
        'on-surface': '#0d1c2e',
        'on-background': '#0d1c2e',
        'primary-fixed-dim': '#a6c8ff',
        'on-primary-container': '#7ea5e2',
        'on-primary': '#ffffff',
        'surface-variant': '#d5e3fc',
        'on-tertiary-fixed': '#00210a',
        background: '#f8f9ff',
        'on-secondary-fixed': '#001d31',
        'primary-fixed': '#d5e3ff',
        'on-secondary-fixed-variant': '#004b73',
        'surface-dim': '#ccdbf3',
        secondary: '#006398',
        'on-primary-fixed-variant': '#18477e',
        'inverse-on-surface': '#eaf1ff',
        'secondary-container': '#5bb8fe',
        'primary-container': '#003a70',
        'on-tertiary-fixed-variant': '#005323',
        'surface-container-lowest': '#ffffff',
        'tertiary-container': '#00441b',
        'surface-container-high': '#dce9ff',
        error: '#ba1a1a',
        'secondary-fixed': '#cce5ff',
        outline: '#737781',
        'on-surface-variant': '#434750',
        'on-primary-fixed': '#001c3b',
        'on-tertiary-container': '#56b76d',
        'surface-container-low': '#eff4ff',
        'inverse-primary': '#a6c8ff',
        'secondary-fixed-dim': '#93ccff',
        'on-secondary-container': '#00476e',
        'surface-container': '#e6eeff',
        'surface-bright': '#f8f9ff',
      },
      fontFamily: {
        'headline-md': ['Plus Jakarta Sans', 'sans-serif'],
        'body-lg': ['Plus Jakarta Sans', 'sans-serif'],
        'headline-lg-mobile': ['Plus Jakarta Sans', 'sans-serif'],
        'headline-xl-mobile': ['Plus Jakarta Sans', 'sans-serif'],
        'headline-xl': ['Plus Jakarta Sans', 'sans-serif'],
        'label-md': ['Plus Jakarta Sans', 'sans-serif'],
        'label-lg': ['Plus Jakarta Sans', 'sans-serif'],
        'label-sm': ['Plus Jakarta Sans', 'sans-serif'],
        'headline-sm': ['Plus Jakarta Sans', 'sans-serif'],
        'body-md': ['Plus Jakarta Sans', 'sans-serif'],
        'body-sm': ['Plus Jakarta Sans', 'sans-serif'],
        'headline-lg': ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          id="tailwind-config"
          dangerouslySetInnerHTML={{
            __html: `tailwind.config = ${tailwindConfigJson};`,
          }}
        />
      </head>
      <body className="bg-surface font-body-md text-on-surface flex flex-col min-h-screen selection:bg-secondary-fixed selection:text-on-secondary-fixed">
        <PortalShell>{children}</PortalShell>
      </body>
    </html>
  );
}
