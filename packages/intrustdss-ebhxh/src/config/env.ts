export type AppEnvironment = 'dev' | 'uat' | 'prod';

export const eBhxhConfigs: Record<AppEnvironment, { envName: AppEnvironment; domain: string; apiBaseUrl: string; apiKey: string }> = {
  dev: { envName: 'dev', domain: 'dev-ebhxh.intrustdss.vn', apiBaseUrl: 'https://dev-ebhxh-api.intrustdss.vn/api/v1', apiKey: 'dev_ebhxh_api_key_59201' },
  uat: { envName: 'uat', domain: 'uat-ebhxh.intrustdss.vn', apiBaseUrl: 'https://uat-ebhxh-api.intrustdss.vn/api/v1', apiKey: 'uat_ebhxh_api_key_33847' },
  prod: { envName: 'prod', domain: 'ebhxh.intrustdss.vn', apiBaseUrl: 'https://ebhxh-api.intrustdss.vn/api/v1', apiKey: 'prod_ebhxh_live_key_84930' },
};

export const getEBhxhConfig = (env: AppEnvironment = 'dev') => eBhxhConfigs[env] || eBhxhConfigs.dev;
