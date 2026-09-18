export type AppEnvironment = 'dev' | 'uat' | 'prod';

export interface MiniAppUserInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  roles?: string[];
}

export interface InTraceProps {
  /** JWT / Bearer Token từ Super App */
  token: string;
  /** Thông tin người dùng hiện tại */
  userInfo: MiniAppUserInfo;
  /** Môi trường máy chủ (dev, uat, prod) */
  environment: AppEnvironment;
  /** Chế độ hiển thị */
  colorScheme?: 'light' | 'dark';
  /** Callback khi bấm thoát về Super App */
  onExit?: () => void;
  /** Callback khi token hết hạn */
  onSessionExpired?: () => void;
}

export interface InTraceEnvironmentConfig {
  envName: AppEnvironment;
  displayName: string;
  domain: string;
  apiBaseUrl: string;
  apiKey: string;
  enableDebugLogs: boolean;
  timeoutMs: number;
}
