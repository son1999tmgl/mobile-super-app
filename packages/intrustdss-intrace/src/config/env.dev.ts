import { InTraceEnvironmentConfig } from '../types';

export const inTraceDevConfig: InTraceEnvironmentConfig = {
  envName: 'dev',
  displayName: 'Phát triển (DEV)',
  domain: 'trace.intrustdss.xyz',
  apiBaseUrl: 'https://trace.intrustdss.xyz/api',
  apiKey: 'dev_intrace_api_key_84920',
  enableDebugLogs: true,
  timeoutMs: 15000,
};
