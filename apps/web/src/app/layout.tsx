import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { PortalShell } from '../components/portal-shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portal demonstrativo | Centro Médico Adventista Curitiba',
  description: 'Autoatendimento administrativo demonstrativo do CMAC.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="pt-BR"><body><PortalShell>{children}</PortalShell></body></html>;
}
