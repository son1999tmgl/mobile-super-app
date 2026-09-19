import { useState } from 'react';
import { Alert } from 'react-native';
import { loginUser } from '../../api/authApi';
import { UserInfo } from '../../types/auth';

export function useLogin(
  gatewayUrl: string,
  onLoginSuccess: (token: string, userInfo: UserInfo) => void
) {
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
      const result = await loginUser(gatewayUrl, {
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

  return {
    taxCode,
    setTaxCode,
    username,
    setUsername,
    password,
    setPassword,
    loading,
    handleLogin,
  };
}
