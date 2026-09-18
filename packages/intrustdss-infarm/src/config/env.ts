export type AppEnvironment = 'dev' | 'uat' | 'prod';

export const inFarmConfigs: Record<AppEnvironment, { envName: AppEnvironment; domain: string; apiBaseUrl: string; apiKey: string }> = {
  dev: { envName: 'dev', domain: 'dev-infarm.intrustdss.vn', apiBaseUrl: 'https://dev-infarm-api.intrustdss.vn/api/v1', apiKey: 'dev_infarm_api_key_38472' },
  uat: { envName: 'uat', domain: 'uat-infarm.intrustdss.vn', apiBaseUrl: 'https://uat-infarm-api.intrustdss.vn/api/v1', apiKey: 'uat_infarm_api_key_12093' },
  prod: { envName: 'prod', domain: 'infarm.intrustdss.vn', apiBaseUrl: 'https://infarm-api.intrustdss.vn/api/v1', apiKey: 'prod_infarm_live_key_55102' },
};

export const getInFarmConfig = (env: AppEnvironment = 'dev') => inFarmConfigs[env] || inFarmConfigs.dev;
