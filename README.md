# intrustDSS Mobile Super App Ecosystem

Hệ sinh thái Super App và các Mini App độc lập trên nền tảng **React Native / Expo** của **intrustDSS**.

## 📚 Mục lục Tài liệu

1. [**HUONG_DAN_CHAY.md**](file:///d:/mobile%20app/HUONG_DAN_CHAY.md): **Hướng dẫn cách chạy ứng dụng từ A-Z** (Chạy thử inTrace độc lập hoặc chạy trọn bộ Super App).
2. [**ARCHITECTURE.md**](file:///d:/mobile%20app/ARCHITECTURE.md): Kiến trúc tổng quan Super App, luồng trao đổi dữ liệu, đa môi trường `dev/uat/prod` và chiến lược cập nhật tức thì OTA qua EAS Update.
3. [**MINI_APP_STANDARD.md**](file:///d:/mobile%20app/MINI_APP_STANDARD.md): Quy chuẩn bắt buộc cho các team mini-app (`@intrustdss/intrace`, `@intrustdss/econtract`, `@intrustdss/infarm`, `@intrustdss/ebhxh`).
4. [**SETUP_COMMANDS.md**](file:///d:/mobile%20app/SETUP_COMMANDS.md): Danh mục câu lệnh Terminal khởi tạo repo, cấu hình package và đẩy bản cập nhật.
5. [**HUONG_DAN_DEPLOY_STORE.md**](file:///d:/mobile%20app/HUONG_DAN_DEPLOY_STORE.md): **Hướng dẫn Triển khai lên App Store & Google Play từ A-Z** (EAS Build, EAS Submit, OTA Updates).

## 📁 Cấu trúc Thư mục

```
d:/mobile app/
├── HUONG_DAN_CHAY.md       # Xem file này để biết cách bật app chạy ngay!
├── ARCHITECTURE.md          # Tài liệu kiến trúc
├── MINI_APP_STANDARD.md     # Quy chuẩn team con
├── SETUP_COMMANDS.md        # Lệnh terminal A-Z
├── super-app/               # Dự án App Tổng (Host Container)
└── packages/                # Các thư viện Mini App độc lập
    ├── intrustdss-intrace/  # Mini App inTrace (Quản lý Thùng & Công, Camera Scanner Native)
    ├── intrustdss-econtract/# Mini App eContract (Hợp đồng & Ký số)
    ├── intrustdss-infarm/   # Mini App inFarm (Nông trại số VietGAP)
    └── intrustdss-ebhxh/    # Mini App eBHXH (Bảo hiểm xã hội điện tử)
```
