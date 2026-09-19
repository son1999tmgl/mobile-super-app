import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, AppCard, AppTextInput } from '@intrustdss/ui';
import { SuperAppEnvironmentConfig } from '../../config/types';
import { UserInfo } from '../../types/auth';
import { useLogin } from './useLogin';
import { styles } from './Login.styles';

interface LoginScreenProps {
  config: SuperAppEnvironmentConfig;
  onLoginSuccess: (token: string, userInfo: UserInfo) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ config, onLoginSuccess }) => {
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);
  const {
    taxCode,
    setTaxCode,
    username,
    setUsername,
    password,
    setPassword,
    loading,
    handleLogin,
  } = useLogin(config.gatewayUrl, onLoginSuccess);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Brand Header */}
        <View style={styles.brandBox}>
          <Text style={styles.brandTitle}>intrustDSS</Text>
          <Text style={styles.brandSub}>HỆ THỐNG TRUY XUẤT &amp; XÁC THỰC DOANH NGHIỆP</Text>
        </View>

        {/* Card Form dùng chung từ Design System */}
        <AppCard variant="elevated" padding="lg">
          <Text style={styles.formTitle}>Đăng Nhập Tài Khoản</Text>
          <Text style={styles.formSubtitle}>Sử dụng tài khoản inTrace để truy cập toàn bộ hệ sinh thái</Text>

          <AppTextInput
            label="Mã số thuế / Mã đơn vị"
            placeholder="VD: 0101234567"
            value={taxCode}
            onChangeText={setTaxCode}
            autoCapitalize="none"
            autoCorrect={false}
            required
            leftIcon={<Text style={{ fontSize: 16 }}>🏢</Text>}
          />

          <AppTextInput
            label="Tên đăng nhập"
            placeholder="Tên tài khoản hoặc email"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            required
            leftIcon={<Text style={{ fontSize: 16 }}>👤</Text>}
          />

          <AppTextInput
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            required
            leftIcon={<Text style={{ fontSize: 16 }}>🔒</Text>}
            rightIcon={<Text style={{ fontSize: 16 }}>{showPassword ? '👁️' : '🙈'}</Text>}
            onRightIconPress={() => setShowPassword((prev) => !prev)}
          />

          <View style={{ marginTop: 12 }}>
            <AppButton
              title="ĐĂNG NHẬP"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onPress={handleLogin}
            />
          </View>
        </AppCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
