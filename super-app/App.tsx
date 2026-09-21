if (__DEV__) {
  require('./src/config/ReactotronConfig');
}

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HostErrorBoundary } from './src/components/HostErrorBoundary';
import { LoginScreen } from './src/screens/Login/LoginScreen';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ACTIVE_APP_CONFIG } from './src/config/env';
import { useAuthSession } from './src/hooks/useAuthSession';
import { COLORS } from './src/constants/theme';
import { LogBox } from 'react-native';

export default function App() {
  // Bỏ qua cảnh báo InteractionManager từ thư viện navigation
  LogBox.ignoreLogs(['InteractionManager has been deprecated']);
  const appConfig = ACTIVE_APP_CONFIG;
  const { token, user, isAuthenticated, isLoading, login, logout } = useAuthSession();
  return (
    <SafeAreaProvider>
      <HostErrorBoundary>
        <StatusBar style="light" />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.brandTitle}>intrustDSS</Text>
            <ActivityIndicator size="large" color={COLORS.primaryLight} style={styles.spinner} />
            <Text style={styles.loadingText}>Đang nạp phiên làm việc...</Text>
          </View>
        ) : !isAuthenticated || !token || !user ? (
          <LoginScreen
            config={appConfig}
            onLoginSuccess={login}
          />
        ) : (
          <RootNavigator
            appConfig={appConfig}
            authToken={token}
            currentUser={user}
            onLogout={logout}
          />
        )}
      </HostErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.brandAccent,
    letterSpacing: 2,
    marginBottom: 24,
  },
  spinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
});
