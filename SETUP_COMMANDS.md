# Hướng dẫn Lệnh Terminal từ A-Z (intrustDSS Super App)

Tài liệu này cung cấp toàn bộ các câu lệnh thực thi (áp dụng cho cả **Bash** trên macOS/Linux và **PowerShell** trên Windows) để thiết lập và chạy thử nghiệm hệ sinh thái Super App.

---

## 1. Lệnh tạo Mini App độc lập (Ví dụ: `@intrustdss/intrace`)

### Bước 1.1: Tạo cấu trúc thư mục repo mini app
```bash
# Tạo thư mục gốc cho repo mini app
mkdir -p intrustdss-intrace/src/config intrustdss-intrace/src/components intrustdss-intrace/src/screens intrustdss-intrace/src/navigation intrustdss-intrace/src/types intrustdss-intrace/src/services

cd intrustdss-intrace

# Khởi tạo package.json cho thư viện
npm init -y
```

### Bước 1.2: Cấu hình `package.json` cho thư viện mini app
Chỉnh sửa file `package.json`:
```json
{
  "name": "@intrustdss/intrace",
  "version": "1.0.0",
  "description": "Mini App Truy xuất nguồn gốc inTrace cho Super App intrustDSS",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "test:runner": "cd standalone-runner && npm start"
  },
  "peerDependencies": {
    "react": "*",
    "react-native": "*",
    "@react-navigation/native": "*",
    "@react-navigation/stack": "*",
    "expo-camera": "*"
  },
  "dependencies": {
    "dayjs": "^1.11.10"
  }
}
```

### Bước 1.3: Tạo môi trường kiểm thử độc lập (`standalone-runner`)
```bash
# Đứng tại thư mục intrustdss-intrace
# Tạo app Expo độc lập để anh em team inTrace tự test
npx create-expo-app@latest standalone-runner --template blank-typescript --no-install

cd standalone-runner

# Cài đặt các dependencies cần thiết để chạy test
npx expo install react-native-screens react-native-safe-area-context @react-navigation/native @react-navigation/stack expo-camera

# Cài đặt package mini-app từ thư mục cha vào runner
npm install ../
```

### Bước 1.4: Chạy thử riêng Mini App
```bash
# Đứng tại thư mục standalone-runner
npm start
# Quét mã QR bằng ứng dụng Expo Go trên điện thoại để bắt đầu code & test
```

---

## 2. Lệnh tạo và thiết lập Super App (App Tổng)

### Bước 2.1: Tạo dự án Expo cho Super App
```bash
# Trở về thư mục dự án gốc
cd ..

# Tạo Super App
npx create-expo-app@latest super-app --template blank-typescript --no-install

cd super-app

# Cài đặt các thư viện nền tảng Expo
npx expo install expo-camera react-native-screens react-native-safe-area-context @react-navigation/native @react-navigation/stack expo-status-bar
```

### Bước 2.2: Liên kết (Link) các Mini App nội bộ vào App Tổng

#### Cách 1: Liên kết trực tiếp qua đường dẫn cục bộ (Local Path - Dùng khi Dev)
Trong `super-app/package.json`:
```json
{
  "dependencies": {
    "@intrustdss/intrace": "file:../packages/intrustdss-intrace",
    "@intrustdss/econtract": "file:../packages/intrustdss-econtract",
    "@intrustdss/infarm": "file:../packages/intrustdss-infarm",
    "@intrustdss/ebhxh": "file:../packages/intrustdss-ebhxh"
  }
}
```
Sau đó chạy:
```bash
npm install
```

#### Cách 2: Cài đặt qua Git Repository riêng biệt của từng team (Production/CI)
```bash
npm install git+https://github.com/intrustdss/intrace-mobile.git#v1.0.0
# hoặc nếu dùng npm private registry (Verdaccio):
# npm install @intrustdss/intrace@1.0.0
```

### Bước 2.3: Chạy Super App
```bash
# Đứng tại thư mục super-app
npm start
```

---

## 3. Lệnh Cấu hình & Đẩy Cập nhật Tức thì OTA (EAS Update)

### Bước 3.1: Đăng nhập và Khởi tạo EAS
```bash
# Cài đặt EAS CLI toàn cục nếu chưa có
npm install -g eas-cli

# Đăng nhập vào tài khoản Expo của công ty
eas login

# Khởi tạo dự án EAS trong thư mục super-app
cd super-app
eas project:init
```

### Bước 3.2: Cấu hình kênh Update (Channels & Branches)
```bash
# Tạo các kênh tương ứng 3 môi trường
eas channel:create development
eas channel:create preview-uat
eas channel:create production
```

### Bước 3.3: Lệnh xuất bản OTA Update khi mini app có tính năng mới
Khi team `inTrace` cập nhật tính năng thêm thùng/công hoặc fix lỗi JS:
```bash
# Cập nhật dependency mini app trong super-app
npm update @intrustdss/intrace

# 1. Đẩy cập nhật cho môi trường Dev (nội bộ tester)
eas update --branch development --message "Dev: inTrace cap nhat tinh nang them thung"

# 2. Đẩy cập nhật cho môi trường UAT (khách hàng test)
eas update --branch preview-uat --message "UAT: inTrace fix barcode scanner"

# 3. Đẩy cập nhật lên Production chính thức (Người dùng nhận ngay lập tức)
eas update --branch production --message "Prod: Release inTrace v1.0.1"
```
Người dùng mở ứng dụng trên điện thoại sẽ tự động nhận được giao diện mới trong vài giây mà không cần lên App Store / CH Play!

---

### Bước 3.4: Lệnh Build xuất file cài đặt (.APK) và Store (.AAB / .IPA)

```bash
# 1. Xuất file APK môi trường DEV cài trực tiếp vào điện thoại Android
npx eas-cli build -p android --profile preview-dev-apk

# 2. Xuất file APK môi trường UAT gửi cho khách hàng/tester
npx eas-cli build -p android --profile preview-uat

# 3. Đóng gói bản Production chính thức (.AAB để nộp lên Google Play Store)
npx eas-cli build -p android --profile production

# 4. Đóng gói bản iOS (.IPA gửi lên Apple TestFlight)
npx eas-cli build -p ios --profile preview-uat
```
*(Lưu ý: Khi chạy lần đầu, nếu hệ thống hỏi `create an EAS project?` hoặc `Generate a new Android Keystore?`, bạn chỉ cần gõ `Y` và nhấn Enter)*.
