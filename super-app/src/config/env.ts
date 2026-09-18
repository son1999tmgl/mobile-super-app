import { superAppDevConfig } from './env.dev';
import { superAppUatConfig } from './env.uat';
import { superAppProdConfig } from './env.prod';
import { AppEnvironment, SuperAppEnvironmentConfig } from './types';

export * from './types';
export { superAppDevConfig, superAppUatConfig, superAppProdConfig };

/**
 * Xác định môi trường chạy của ứng dụng:
 * 1. Đọc từ biến môi trường APP_ENV hoặc EXPO_PUBLIC_APP_ENV (được inject khi build qua EAS hoặc npm script)
 * 2. Mặc định là 'dev' nếu không được chỉ định.
 */
const resolveActiveEnv = (): AppEnvironment => {
  const injectedEnv = (
    process.env.APP_ENV ||
    process.env.EXPO_PUBLIC_APP_ENV ||
    ''
  ).toLowerCase();

  if (injectedEnv === 'prod' || injectedEnv === 'production') {
    return 'prod';
  }
  if (injectedEnv === 'uat' || injectedEnv === 'staging') {
    return 'uat';
  }
  return 'dev';
};

export const ACTIVE_ENV_NAME: AppEnvironment = resolveActiveEnv();

export const getSuperAppConfig = (env: AppEnvironment = ACTIVE_ENV_NAME): SuperAppEnvironmentConfig => {
  switch (env) {
    case 'prod':
      return superAppProdConfig;
    case 'uat':
      return superAppUatConfig;
    case 'dev':
    default:
      return superAppDevConfig;
  }
};

/** Cấu hình môi trường đã được kích hoạt cố định từ file config */
export const ACTIVE_APP_CONFIG: SuperAppEnvironmentConfig = getSuperAppConfig(ACTIVE_ENV_NAME);
