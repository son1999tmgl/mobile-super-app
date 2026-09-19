import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, Platform } from 'react-native';

if (__DEV__) {
  // IP của máy tính chạy Reactotron app
  const host = '192.168.15.180';

  Reactotron.setAsyncStorageHandler?.(AsyncStorage)
    .configure({
      name: 'intrustDSS Super App',
      host,
    })
    .useReactNative({
      asyncStorage: true,
      networking: {
        ignoreUrls: /symbolicate/, // Bỏ qua log bundle của Metro
      },
      editor: false,
      errors: { veto: () => false },
      overlay: false,
    })
    .connect();

  // Xóa log cũ mỗi lần reload app để dễ nhìn
  Reactotron.clear?.();

  console.log(`🚀 [Reactotron] Đã cấu hình và kết nối tới máy chủ host: ${host}:9090`);
}

export default Reactotron;
