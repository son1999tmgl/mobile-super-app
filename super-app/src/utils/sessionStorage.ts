import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserInfo } from '../types/auth';

const TOKEN_KEY = 'INTRUSTDSS_AUTH_TOKEN';
const USER_KEY = 'INTRUSTDSS_AUTH_USER';

/**
 * Lưu trữ bảo mật cho mobile (Keychain/Keystore) và fallback AsyncStorage cho Web
 */
export const SessionStorage = {
  async saveSession(token: string, user: UserInfo): Promise<void> {
    try {
      const userString = JSON.stringify(user);
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(USER_KEY, userString);
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        await SecureStore.setItemAsync(USER_KEY, userString);
      }
    } catch (err) {
      console.error('[SessionStorage] Lỗi lưu phiên đăng nhập:', err);
    }
  },

  async getSession(): Promise<{ token: string; user: UserInfo } | null> {
    try {
      let token: string | null = null;
      let userString: string | null = null;

      if (Platform.OS === 'web') {
        token = await AsyncStorage.getItem(TOKEN_KEY);
        userString = await AsyncStorage.getItem(USER_KEY);
      } else {
        token = await SecureStore.getItemAsync(TOKEN_KEY);
        userString = await SecureStore.getItemAsync(USER_KEY);
      }

      if (token && userString) {
        const user = JSON.parse(userString) as UserInfo;
        return { token, user };
      }
    } catch (err) {
      console.error('[SessionStorage] Lỗi đọc phiên đăng nhập:', err);
    }
    return null;
  },

  async clearSession(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
      }
    } catch (err) {
      console.error('[SessionStorage] Lỗi xóa phiên đăng nhập:', err);
    }
  },
};
