export type AppEnvironment = 'dev' | 'uat' | 'prod';

export interface MiniAppEndpointConfig {
  apiBaseUrl: string;
  apiKey: string;
  timeoutMs?: number;
}

export interface SuperAppEnvironmentConfig {
  envName: AppEnvironment;
  displayName: string;
  domain: string;
  gatewayUrl: string;
  authUrl: string;
  apiKey: string;
  clientId: string;
  enableDebugLogs: boolean;
  timeoutMs: number;
  miniApps: {
    intrace: MiniAppEndpointConfig;
    econtract: MiniAppEndpointConfig;
    infarm: MiniAppEndpointConfig;
    ebhxh: MiniAppEndpointConfig;
  };
}
