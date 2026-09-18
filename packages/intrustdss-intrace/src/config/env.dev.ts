import { InTraceEnvironmentConfig } from '../types';

export const inTraceDevConfig: InTraceEnvironmentConfig = {
  envName: 'dev',
  displayName: 'Phát triển (DEV)',
  domain: 'tracev2.intrustdss.vn',
  apiBaseUrl: 'https://tracev2.intrustdss.vn/api',
  apiKey: 'dev_intrace_api_key_84920',
  enableDebugLogs: true,
  timeoutMs: 15000,
};
