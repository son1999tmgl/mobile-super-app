import { InTraceEnvironmentConfig } from '../types';

export const inTraceProdConfig: InTraceEnvironmentConfig = {
  envName: 'prod',
  displayName: 'Chính thức (Production)',
  domain: 'intrace.intrustdss.vn',
  apiBaseUrl: 'https://intrace-api.intrustdss.vn/api/v1',
  apiKey: 'prod_intrace_live_key_90234',
  enableDebugLogs: false,
  timeoutMs: 30000,
};
