export type AppEnvironment = 'dev' | 'uat' | 'prod';

export interface EContractEnvironmentConfig {
  envName: AppEnvironment;
  domain: string;
  apiBaseUrl: string;
  apiKey: string;
}

export const eContractConfigs: Record<AppEnvironment, EContractEnvironmentConfig> = {
  dev: {
    envName: 'dev',
    domain: 'dev-econtract.intrustdss.vn',
    apiBaseUrl: 'https://dev-econtract-api.intrustdss.vn/api/v1',
    apiKey: 'dev_econtract_api_key_11029',
  },
  uat: {
    envName: 'uat',
    domain: 'uat-econtract.intrustdss.vn',
    apiBaseUrl: 'https://uat-econtract-api.intrustdss.vn/api/v1',
    apiKey: 'uat_econtract_api_key_99301',
  },
  prod: {
    envName: 'prod',
    domain: 'econtract.intrustdss.vn',
    apiBaseUrl: 'https://econtract-api.intrustdss.vn/api/v1',
    apiKey: 'prod_econtract_live_key_67482',
  },
};

export const getEContractConfig = (env: AppEnvironment = 'dev') => eContractConfigs[env] || eContractConfigs.dev;
