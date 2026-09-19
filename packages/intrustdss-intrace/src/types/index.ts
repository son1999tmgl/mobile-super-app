export * from './carton';
export * from './container';
export * from './product';

export type AppEnvironment = 'dev' | 'uat' | 'prod';

export interface InTraceEnvironmentConfig {
  envName: string;
  displayName: string;
  domain?: string;
  apiBaseUrl: string;
  apiKey: string;
  enableDebugLogs?: boolean;
  timeoutMs?: number;
  name?: string;
}

export interface InTraceUserInfo {
  id?: string;
  name: string;
  tax_code?: string;
  accountId?: string;
  username: string;
  companyName?: string;
}

export interface InTraceProps {
  token: string;
  userInfo: InTraceUserInfo;
  environment: AppEnvironment;
  apiBaseUrl?: string;
  apiKey?: string;
  onExit?: () => void;
  onSessionExpired?: () => void;
}
