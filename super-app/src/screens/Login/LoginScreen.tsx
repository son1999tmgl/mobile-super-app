import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SuperAppEnvironmentConfig } from '../../config/types';
import { UserInfo } from '../../types/auth';
import { COLORS } from '../../constants/theme';
import { useLogin } from './useLogin';
import { styles } from './Login.styles';

interface LoginScreenProps {
  config: SuperAppEnvironmentConfig;
  onLoginSuccess: (token: string, userInfo: UserInfo) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ config, onLoginSuccess }) => {
  const insets = useSafeAreaInsets();
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

        {/* Card Form */}
        <View style={styles.card}>
          <Text style={styles.formTitle}>Đăng Nhập Tài Khoản</Text>
          <Text style={styles.formSubtitle}>Sử dụng tài khoản inTrace để truy cập toàn bộ hệ sinh thái</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mã số thuế / Mã đơn vị (*)</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: 0101234567"
              placeholderTextColor={COLORS.textSecondary}
              value={taxCode}
              onChangeText={setTaxCode}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên đăng nhập (*)</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên tài khoản hoặc email"
              placeholderTextColor={COLORS.textSecondary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu (*)</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              placeholderTextColor={COLORS.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textLight} />
            ) : (
              <Text style={styles.loginBtnText}>ĐĂNG NHẬP</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
