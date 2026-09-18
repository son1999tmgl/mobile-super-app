export interface UserInfo {
  id?: string;
  name: string;
  tax_code?: string;
  username: string;
  companyName?: string;
  roles?: string[];
  email?: string;
  phone?: string;
}

export interface LoginCredentials {
  taxCode: string;
  username: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  token?: string;
  user?: UserInfo;
  error?: string;
  statusCode?: number;
}
