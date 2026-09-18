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
