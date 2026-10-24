# Integrações do Sistema — Portal CMAC

## 1. SOUL MV (MV Sistemas)
- **Camada Simulada / Contrato de Integração:** `apps/web/src/lib/demo/demo-service.ts` e `demo-auth.ts`.
- **Entidades Mapeadas:**
  - Pacientes e Matrículas (`DEMO-PAC-*`)
  - Agendamentos e Protocolos MV (`CMAC-DEMO-*`)
  - Prontuário Eletrônico do Paciente (PEP SOUL MV)
  - Fila de Espera Ambulatorial & Chamada Touch

## 2. Padrões Regulatórios e de Segurança
- **ICP-Brasil (MP nº 2.200-2/2001):** Certificação digital com autenticação SHA-256 em laudos e prescrições.
- **CFM nº 2.314/2022:** Telemedicina com validação de termos e sala síncrona.
- **LGPD (Lei 13.709/2018):** Termos de consentimento para dados sensíveis com assinatura digital tátil.

## 3. Farmácias & Convênios
- **Redes Conveniadas:** QRCode de dispensação aceito em redes nacionais (Raia, Pague Menos, Nissei, Panvel).
- **Convênios Aceitos:** Unimed Curitiba, Bradesco Saúde, Particular, etc.
