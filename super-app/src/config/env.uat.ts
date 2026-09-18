import { SuperAppEnvironmentConfig } from './types';

// Cấu hình môi trường Kiểm thử (UAT / Staging)
export const superAppUatConfig: SuperAppEnvironmentConfig = {
  envName: 'uat',
  displayName: 'Kiểm thử (UAT)',
  domain: 'uat.intrustdss.vn',
  gatewayUrl: 'https://uat-api-gateway.intrustdss.vn/api/v1',
  authUrl: 'https://uat-sso.intrustdss.vn/oauth',
  apiKey: 'uat_sec_key_intrust_dss_44820193',
  clientId: 'intrustdss-mobile-uat',
  enableDebugLogs: true,
  timeoutMs: 20000,
  miniApps: {
    intrace: {
      apiBaseUrl: 'https://uat-intrace-api.intrustdss.vn/api/v1',
      apiKey: 'uat_intrace_api_key_77192',
      timeoutMs: 20000,
    },
    econtract: {
      apiBaseUrl: 'https://uat-econtract-api.intrustdss.vn/api/v1',
      apiKey: 'uat_econtract_api_key_99301',
      timeoutMs: 20000,
    },
    infarm: {
      apiBaseUrl: 'https://uat-infarm-api.intrustdss.vn/api/v1',
      apiKey: 'uat_infarm_api_key_12093',
      timeoutMs: 20000,
    },
    ebhxh: {
      apiBaseUrl: 'https://uat-ebhxh-api.intrustdss.vn/api/v1',
      apiKey: 'uat_ebhxh_api_key_33847',
      timeoutMs: 20000,
    },
  },
};
