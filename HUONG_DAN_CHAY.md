# Hướng Dẫn Chạy Ứng Dụng Từ A-Z (Quickstart Guide)

Tài liệu này hướng dẫn bạn cách khởi động và chạy ứng dụng trên thiết bị thật (Expo Go) hoặc máy ảo (Simulator/Emulator) với **cơ chế quản lý môi trường chuẩn thông qua File Cấu Hình**.

---

## 🛠️ 1. Yêu cầu Môi trường (Prerequisites)

1. **Máy tính đã cài:**
   - **Node.js**: Phiên bản 18 trở lên (Khuyến nghị Node.js 20 LTS).
   - **Git**: Đã cài đặt.
2. **Thiết bị chạy thử (chọn 1 trong 2):**
   - **Điện thoại thật (Khuyên dùng):** Cài ứng dụng **Expo Go** từ CH Play (Android) hoặc App Store (iOS).
   - **Máy ảo:** Android Studio (Android Emulator) hoặc Xcode Simulator (macOS).

---

## ⚙️ 2. Cơ chế Quản lý Môi trường qua File Cấu hình (DEV / UAT / PROD)

Ứng dụng **không cho phép người dùng tự đổi môi trường trên giao diện**. Mọi thông số kết nối (Domain, API Gateway, API Key, SSO Auth, cấu hình Mini App) được tách biệt thành từng file:

- `src/config/env.dev.ts`: Môi trường DEV (`dev.intrustdss.vn`)
- `src/config/env.uat.ts`: Môi trường UAT/Staging (`uat.intrustdss.vn`)
- `src/config/env.prod.ts`: Môi trường Production chính thức (`intrustdss.vn`)

Khi chạy hoặc build ứng dụng, hệ thống sẽ tự nạp đúng file cấu hình tương ứng dựa trên lệnh khởi chạy.

---

## 🌐 3. Cách 1: Chạy App Tổng (Super App)

Super App là ứng dụng tổng chứa SSO Login, danh sách Mini App và nạp các app con (`inTrace`, `eContract`, `inFarm`, `eBHXH`).

### Bước 1: Mở Terminal và vào thư mục `super-app`
```bash
cd "d:\mobile app\super-app"
```

### Bước 2: Cài đặt dependencies (chỉ cần lần đầu)
```bash
npm install
```

### Bước 3: Khởi động theo môi trường mong muốn
Chọn 1 trong các lệnh tương ứng với môi trường bạn cần:

```bash
# Chạy với cấu hình DEV (Mặc định: dev.intrustdss.vn & dev API keys)
npm run start:dev

# Chạy với cấu hình UAT (uat.intrustdss.vn & uat API keys)
npm run start:uat

# Chạy với cấu hình Production (intrustdss.vn & live API keys)
npm run start:prod
```

### Bước 4: Mở app
- Quét mã QR bằng ứng dụng **Expo Go** trên điện thoại (hoặc bấm `a` cho Android Emulator, `i` cho iOS Simulator).
- Trên Header sẽ hiển thị Badge cố định của môi trường (ví dụ `DEV`).
- Cuối màn hình có bảng thông tin chi tiết: Tên file config (`env.dev.ts`), Domain, Gateway URL, Client ID.
- Bấm vào thẻ **inTrace** để mở module Quản lý Thùng & Container.

---

## 📱 4. Cách 2: Chạy Riêng Mini App `inTrace` (Standalone Runner)

Dành cho team `inTrace` muốn code và kiểm thử độc lập các tính năng **Thêm Thùng**, **Thêm Công**, và **Quét Camera Barcode** mà không cần qua App tổng:

### Bước 1: Mở Terminal và vào thư mục standalone runner
```bash
cd "d:\mobile app\packages\intrustdss-intrace\standalone-runner"
```

### Bước 2: Cài đặt dependencies (chỉ cần lần đầu)
```bash
npm install
```

### Bước 3: Khởi động độc lập theo môi trường
```bash
# Chạy độc lập với cấu hình DEV
npm run start:dev

# Chạy độc lập với cấu hình UAT
npm run start:uat

# Chạy độc lập với cấu hình PROD
npm run start:prod
```

### Bước 4: Trải nghiệm
- Quét mã QR bằng **Expo Go**.
- Runner sẽ nạp cấu hình tương ứng từ `../src/config/env.[env].ts`.
- Bấm nút **📷 Quét mã** để kiểm tra tính năng Camera Native quét Barcode/QR.

---

## ⌨️ 5. Bảng Phím Tắt Tiện Lợi Khi Đang Chạy Expo

| Phím | Chức năng |
| :---: | :--- |
| `r` | **Reload app:** Tải lại giao diện ngay lập tức |
| `m` | **Toggle Dev Menu:** Bật menu debug của Expo / React Native |
| `c` | **Clear cache:** Xóa bộ nhớ cache Metro bundler |
| `a` | **Mở trên Android Emulator** |
| `i` | **Mở trên iOS Simulator** |
| `Ctrl + C` | **Dừng server** |

---

## 🚀 6. Đóng gói & Phát hành OTA theo Môi trường (EAS Update)

Trong `super-app/eas.json`, từng kênh (channel) đã được gắn chặt với biến môi trường `APP_ENV`:

```bash
cd "d:\mobile app\super-app"

# Đẩy cập nhật JS/Assets lên kênh development (nạp env.dev.ts)
npm run update:dev

# Đẩy cập nhật lên kênh preview-uat (nạp env.uat.ts)
npm run update:uat

# Đẩy cập nhật lên kênh production chính thức (nạp env.prod.ts)
npm run update:prod
```

---

## 📦 7. Xuất File Cài Đặt Trực Tiếp (.APK) & Đóng Gói Lên Store

### 7.1. Các lệnh Build theo từng môi trường
Chạy tại thư mục `d:\mobile app\super-app`:

```bash
# 1. Xuất file APK môi trường DEV (Cài trực tiếp lên điện thoại Android để test)
npx eas-cli build -p android --profile preview-dev-apk

# 2. Xuất file APK môi trường UAT (Gửi file APK cho Tester/Khách hàng kiểm thử)
npx eas-cli build -p android --profile preview-uat

# 3. Đóng gói bản Production chính thức (.AAB để nộp lên Google Play Store)
npx eas-cli build -p android --profile production

# 4. Đóng gói bản iOS (.IPA gửi lên Apple TestFlight / App Store)
npx eas-cli build -p ios --profile preview-uat
```

---

### 7.2. Giải thích chi tiết các câu hỏi khi Build lần đầu (Chọn Y hay N?)

Khi lần đầu chạy lệnh build, EAS CLI sẽ đưa ra 2 câu hỏi cấu hình:

1. **Câu hỏi 1:** `Would you like to automatically create an EAS project for @sonnxtmgl/intrustdss-super-app?`
   * 👉 **Hành động: Chọn `Y` (Yes) rồi nhấn Enter.**
   * **Bản chất:** EAS cần liên kết mã nguồn ở máy bạn với tài khoản Expo Cloud (`@sonnxtmgl`). Khi chọn `Y`:
     * EAS sẽ tự động tạo một dự án mới tên `intrustdss-super-app` trên dashboard https://expo.dev.
     * EAS tự động sinh một mã định danh dự án `projectId` (chuỗi UUID) và ghi vào file `app.json`.
   * *Nếu chọn `N`: Quá trình build sẽ bị hủy vì không xác định được dự án trên Cloud.*

2. **Câu hỏi 2:** `Generate a new Android Keystore?`
   * 👉 **Hành động: Chọn `Y` (Generate a new keystore) rồi nhấn Enter.**
   * **Bản chất:** Hệ điều hành Android bắt buộc mọi file `.apk` phải được ký bằng một chứng chỉ số (Keystore) thì mới cài đặt được.
   * Khi chọn `Y`, hệ thống EAS Cloud sẽ tự động sinh Keystore và bảo mật trên máy chủ Expo. Bạn không cần phải dùng công cụ dòng lệnh `keytool` của Java để tạo thủ công hay lo sợ bị mất khóa ký.

---

### 7.3. Khi các dự án con (Mini App) thay đổi thì sao? Làm sao để tự động cập nhật?

Đây là cơ chế cốt lõi của kiến trúc **Super App / Mini App kết hợp Expo OTA (Over-The-Air Update)**:

#### 1. Bản chất kiến trúc đóng gói:
* Toàn bộ mã nguồn của các Mini App (như `packages/intrustdss-intrace`) hiện đang được liên kết trực tiếp vào `super-app`.
* Khi bạn chạy `eas build`, file APK được sinh ra sẽ chứa:
  * **Native Runtime**: Khung chạy Android (Camera, bộ biên dịch Hermes, mã C++/Java).
  * **JavaScript Bundle**: Toàn bộ logic, màn hình, mã TypeScript của cả Super App và các Mini App con.

#### 2. Khi dự án con (Mini App) thay đổi code, cập nhật như thế nào?
Bạn **KHÔNG CẦN** phải xuất lại file APK mỗi lần sửa lỗi hay thêm tính năng cho Mini App! Hãy phân biệt 2 trường hợp:

| Trường hợp thay đổi | Cách cập nhật | Người dùng nhận thế nào? |
| :--- | :--- | :--- |
| **Sửa logic JS/TS, thêm màn hình, sửa API, đổi giao diện Mini App** *(95% công việc hàng ngày)* | **Chạy OTA Update (EAS Update):**<br>`npx eas-cli update --branch preview-dev --message "Cap nhat intrace v1.1"` | 🚀 **Tự động 100%:** Khi người dùng mở Super App trên điện thoại, ứng dụng sẽ tự động tải đoạn code mới về trong vài giây. Giao diện Mini App đổi mới ngay lập tức mà **không cần cài lại file APK**! |
| **Cài thêm thư viện Native mới** *(VD: cài thêm thư viện Bluetooth Native, nâng cấp phiên bản Expo SDK)* | **Build lại file APK:**<br>`npx eas-cli build -p android --profile preview-dev-apk` | 📥 Người dùng tải file `.apk` mới về và cài đặt đè lên ứng dụng cũ. |

#### 3. Câu lệnh đẩy cập nhật tự động (OTA) cho Mini App:
Đứng tại thư mục `d:\mobile app\super-app`:
```bash
# Đẩy cập nhật tức thì cho môi trường Dev (Tester thấy ngay)
npx eas-cli update --branch preview-dev --message "Update mini-app intrace: them tinh nang quet ma pallet"

# Đẩy cập nhật tức thì cho môi trường UAT
npx eas-cli update --branch preview-uat --message "UAT: Fix barcode scanner inTrace"

# Đẩy cập nhật tức thì cho Production (Toàn bộ người dùng nhận ngay)
npx eas-cli update --branch production --message "Release inTrace v1.0.1"
```
*(Ghi chú: Lệnh này chỉ mất khoảng 30 giây để hoàn thành vì chỉ đóng gói mã JS/TS, không cần biên dịch lại mã nguồn Java/C++)*.

