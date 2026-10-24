# Preocupações Técnicas e Débito — Portal CMAC

## 1. Persistência de Dados em Ambiente Real
- **Cenário Atual:** Os dados de agendamento, dependentes, termos assinados e prescrições utilizam `localStorage` e serviços em memória (`demo-service.ts`).
- **Próximo Passo:** Conexão com a API REST/GraphQL real do **SOUL MV (MV Sistemas)** ou backend seguro em Node.js/PostgreSQL para persistência permanente.

## 2. WebRTC para Teleconsulta
- **Cenário Atual:** A sala de telemedicina (`/teleconsulta`) possui interface completa, verificação de periféricos e simulação de vídeo/chat.
- **Próximo Passo:** Integrar serviço de sinalização WebRTC real (ex: Daily.co, Twilio Video ou servidor próprio WebRTC) para conferência bidirecional ao vivo.

## 3. Segurança & LGPD
- Certificados e termos assinados devem ser enviados para um storage criptografado em repouso (ex: AWS S3 com SSE-KMS ou Azure Blob Storage com carimbo de tempo ICP-Brasil emitido por Autoridade Certificadora credenciada).
