import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { AppEnvironment, ACTIVE_APP_CONFIG } from '../config/env';
import { UserInfo } from '../types/auth';
import { COLORS } from '../constants/theme';

// Import các Mini App từ thư viện nội bộ
import { InTraceNavigator } from '@intrustdss/intrace';
import { EContractNavigator } from '@intrustdss/econtract';
import { InFarmNavigator } from '@intrustdss/infarm';
import { EBhxhNavigator } from '@intrustdss/ebhxh';

interface MiniAppHostScreenProps {
  appId: 'intrace' | 'econtract' | 'infarm' | 'ebhxh';
  token: string;
  userInfo: UserInfo;
  environment: AppEnvironment;
  onExitToHost: () => void;
  onSessionExpired: () => void;
}

export const MiniAppHostScreen: React.FC<MiniAppHostScreenProps> = ({
  appId,
  token,
  userInfo,
  environment,
  onExitToHost,
  onSessionExpired,
}) => {
  const miniAppConfig = ACTIVE_APP_CONFIG.miniApps[appId];
  const commonProps = {
    token,
    userInfo,
    environment,
    apiBaseUrl: miniAppConfig?.apiBaseUrl,
    apiKey: miniAppConfig?.apiKey,
    onExit: onExitToHost,
    onSessionExpired: () => {
      Alert.alert(
        'Phiên làm việc hết hạn',
        'Token xác thực đã hết hạn, vui lòng đăng nhập lại.',
        [{ text: 'Đồng ý', onPress: onSessionExpired }]
      );
    },
  };

  return (
    <View style={styles.container}>
      {appId === 'intrace' && <InTraceNavigator {...commonProps} />}
      {appId === 'econtract' && <EContractNavigator {...commonProps} />}
      {appId === 'infarm' && <InFarmNavigator {...commonProps} />}
      {appId === 'ebhxh' && <EBhxhNavigator {...commonProps} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
  },
});
