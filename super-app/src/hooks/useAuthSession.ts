import { useState, useEffect, useCallback } from 'react';
import { UserInfo } from '../types/auth';
import { SessionStorage } from '../utils/sessionStorage';

export interface AuthSessionState {
  token: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (newToken: string, newUser: UserInfo) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuthSession(): AuthSessionState {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Tự động phục hồi phiên đăng nhập khi mở app (Auto-login)
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const savedSession = await SessionStorage.getSession();
        if (isMounted && savedSession) {
          setToken(savedSession.token);
          setUser(savedSession.user);
        }
      } catch (err) {
        console.error('[useAuthSession] Lỗi phục hồi phiên:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (newToken: string, newUser: UserInfo) => {
    setToken(newToken);
    setUser(newUser);
    await SessionStorage.saveSession(newToken, newUser);
  }, []);

  const logout = useCallback(async () => {
    setToken(null);
    setUser(null);
    await SessionStorage.clearSession();
  }, []);

  return {
    token,
    user,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    logout,
  };
}
