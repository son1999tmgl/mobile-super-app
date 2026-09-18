import { SuperAppEnvironmentConfig } from './types';

// Cấu hình môi trường Phát triển (DEV) đồng bộ trực tiếp với inTrace (D:\Source\intrace\frontend-dev)
export const superAppDevConfig: SuperAppEnvironmentConfig = {
  envName: 'dev',
  displayName: 'Phát triển (DEV)',
  domain: 'trace.intrustdss.xyz',
  gatewayUrl: 'https://trace.intrustdss.xyz/api',
  authUrl: 'https://trace.intrustdss.xyz/api/login',
  apiKey: 'dev_sec_key_intrust_dss_98234710',
  clientId: 'intrustdss-mobile-dev',
  enableDebugLogs: true,
  timeoutMs: 15000,
  miniApps: {
    intrace: {
      apiBaseUrl: 'https://trace.intrustdss.xyz/api',
      apiKey: 'dev_intrace_api_key_84920',
      timeoutMs: 15000,
    },
    econtract: {
      apiBaseUrl: 'https://dev-econtract-api.intrustdss.vn/api/v1',
      apiKey: 'dev_econtract_api_key_11029',
      timeoutMs: 15000,
    },
    infarm: {
      apiBaseUrl: 'https://dev-infarm-api.intrustdss.vn/api/v1',
      apiKey: 'dev_infarm_api_key_38472',
      timeoutMs: 15000,
    },
    ebhxh: {
      apiBaseUrl: 'https://dev-ebhxh-api.intrustdss.vn/api/v1',
      apiKey: 'dev_ebhxh_api_key_59201',
      timeoutMs: 15000,
    },
  },
};
