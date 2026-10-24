/**
 * Configuração de Conexão com o SOUL MV (MV Sistemas)
 * Baseada no Swagger OpenAPI: /mv-api-portaria/swagger-ui.html
 */

export interface SoulMVConfig {
  baseUrl: string;
  appToken: string;
  clientSecret: string;
  isMock: boolean;
  timeoutMs: number;
}

export const soulMVConfig: SoulMVConfig = {
  baseUrl: process.env.NEXT_PUBLIC_SOULMV_API_URL || 'https://soulmv-sigrah.pbh.gov.br/mv-api-portaria',
  appToken: process.env.SOULMV_APP_TOKEN || '',
  clientSecret: process.env.SOULMV_CLIENT_SECRET || '',
  isMock: process.env.NEXT_PUBLIC_SOULMV_USE_MOCK !== 'false', // Default para modo de demonstração seguro se token não estiver presente
  timeoutMs: 15000,
};
