import { InTraceEnvironmentConfig } from '../types';

export const inTraceUatConfig: InTraceEnvironmentConfig = {
  envName: 'uat',
  displayName: 'Kiểm thử (UAT)',
  domain: 'uat-intrace.intrustdss.vn',
  apiBaseUrl: 'https://uat-intrace-api.intrustdss.vn/api/v1',
  apiKey: 'uat_intrace_api_key_77192',
  enableDebugLogs: true,
  timeoutMs: 20000,
};
