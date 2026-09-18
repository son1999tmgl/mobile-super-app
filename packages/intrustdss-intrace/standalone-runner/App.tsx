import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { InTraceNavigator, AppEnvironment, getInTraceConfig } from '../src';

export default function StandaloneRunnerApp() {
  // Đọc môi trường từ cấu hình hệ thống
  const activeEnv: AppEnvironment = (
    process.env.APP_ENV ||
    process.env.EXPO_PUBLIC_APP_ENV ||
    'dev'
  ).toLowerCase() as AppEnvironment;

  const activeConfig = getInTraceConfig(activeEnv);

  const simulatedUserInfo = {
    id: 'usr-tester-99',
    name: 'Nguyễn Văn Tuấn (Kỹ sư Kho Vận)',
    email: 'tuan.nv@intrustdss.vn',
    companyName: 'intrustDSS Logistics',
    roles: ['OPERATOR', 'QC_INSPECTOR'],
  };

  const simulatedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulated_jwt_token_for_intrace_testing';

  const handleExit = () => {
    Alert.alert(
      'Mô phỏng Super App',
      'Người dùng vừa kích hoạt nút Thoát về Super App từ inTrace Mini App.'
    );
  };

  const handleSessionExpired = () => {
    Alert.alert('Phiên đăng nhập hết hạn', 'Token đã hết hạn, Super App sẽ điều hướng ra màn hình Login.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Simulator Control Bar */}
      <View style={styles.simulatorBar}>
        <View style={styles.simulatorBarLeft}>
          <Text style={styles.simLabel}>RUNNER CHẠY ĐỘC LẬP (inTrace)</Text>
          <Text style={styles.simSub}>
            Domain: {activeConfig.domain} | File: env.{activeConfig.envName}.ts
          </Text>
        </View>

        {/* Badge Môi trường Cố định từ Config */}
        <View style={styles.envBadge}>
          <View style={styles.envDot} />
          <Text style={styles.envBadgeText}>
            {activeConfig.envName.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Nhúng inTrace Mini App Navigator */}
      <NavigationContainer>
        <InTraceNavigator
          token={simulatedToken}
          userInfo={simulatedUserInfo}
          environment={activeConfig.envName}
          onExit={handleExit}
          onSessionExpired={handleSessionExpired}
        />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  simulatorBar: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  simulatorBarLeft: {
    flex: 1,
  },
  simLabel: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  simSub: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
    fontFamily: 'monospace',
  },
  envBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0284C7',
    gap: 5,
  },
  envDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  envBadgeText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
  },
});
