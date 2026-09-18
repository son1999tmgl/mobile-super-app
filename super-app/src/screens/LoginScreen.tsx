import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SuperAppEnvironmentConfig } from '../config/types';
import { UserInfo } from '../types/auth';
import { loginUser } from '../api/authApi';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

interface LoginScreenProps {
  config: SuperAppEnvironmentConfig;
  onLoginSuccess: (token: string, userInfo: UserInfo) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ config, onLoginSuccess }) => {
  const insets = useSafeAreaInsets();

  const [taxCode, setTaxCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const finalTax = taxCode.trim();
    const finalUser = username.trim();
    const finalPass = password;

    if (!finalTax || !finalUser || !finalPass) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ Mã số thuế, Tên đăng nhập và Mật khẩu.');
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser(config.gatewayUrl, {
        taxCode: finalTax,
        username: finalUser,
        password: finalPass,
      });

      if (result.success && result.token && result.user) {
        onLoginSuccess(result.token, result.user);
      } else {
        Alert.alert(
          'Lỗi đăng nhập',
          result.error || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.',
          [{ text: 'Đóng' }]
        );
      }
    } catch (err: any) {
      Alert.alert(
        'Lỗi kết nối',
        err?.message || 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại mạng.',
        [{ text: 'Đóng' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Brand Header */}
        <View style={styles.brandBox}>
          <Text style={styles.brandTitle}>intrustDSS</Text>
          <Text style={styles.brandSub}>HỆ THỐNG TRUY XUẤT & XÁC THỰC DOANH NGHIỆP</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
    justifyContent: 'center',
    flexGrow: 1,
  },
  brandBox: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.brandAccent,
    letterSpacing: 1.5,
  },
  brandSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginTop: 6,
    fontWeight: '600',
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.xl,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  formSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: SPACING.lg,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: SPACING.lg - 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.lightBg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm + 2,
  },
  loginBtnDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  loginBtnText: {
    color: COLORS.textLight,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
