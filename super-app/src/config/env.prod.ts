import { SuperAppEnvironmentConfig } from './types';

// Cấu hình môi trường Vận hành Chính thức (Production)
export const superAppProdConfig: SuperAppEnvironmentConfig = {
  envName: 'prod',
  displayName: 'Chính thức (Production)',
  domain: 'intrustdss.vn',
  gatewayUrl: 'https://api-gateway.intrustdss.vn/api/v1',
  authUrl: 'https://sso.intrustdss.vn/oauth',
  apiKey: 'prod_live_sec_key_intrust_dss_58392018',
  clientId: 'intrustdss-mobile-live',
  enableDebugLogs: false,
  timeoutMs: 30000,
  miniApps: {
    intrace: {
      apiBaseUrl: 'https://intrace-api.intrustdss.vn/api/v1',
      apiKey: 'prod_intrace_live_key_90234',
      timeoutMs: 30000,
    },
    econtract: {
      apiBaseUrl: 'https://econtract-api.intrustdss.vn/api/v1',
      apiKey: 'prod_econtract_live_key_67482',
      timeoutMs: 30000,
    },
    infarm: {
      apiBaseUrl: 'https://infarm-api.intrustdss.vn/api/v1',
      apiKey: 'prod_infarm_live_key_55102',
      timeoutMs: 30000,
    },
    ebhxh: {
      apiBaseUrl: 'https://ebhxh-api.intrustdss.vn/api/v1',
      apiKey: 'prod_ebhxh_live_key_84930',
      timeoutMs: 30000,
    },
  },
};
