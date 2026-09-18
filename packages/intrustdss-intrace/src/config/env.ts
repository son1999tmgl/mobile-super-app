import { inTraceDevConfig } from './env.dev';
import { inTraceUatConfig } from './env.uat';
import { inTraceProdConfig } from './env.prod';
import { AppEnvironment, InTraceEnvironmentConfig } from '../types';

export const getInTraceConfig = (env: AppEnvironment = 'dev'): InTraceEnvironmentConfig => {
  switch (env) {
    case 'prod':
      return inTraceProdConfig;
    case 'uat':
      return inTraceUatConfig;
    case 'dev':
    default:
      return inTraceDevConfig;
  }
};
