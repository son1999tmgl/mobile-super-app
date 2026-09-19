# Quy chuẩn Phát triển Mini App - intrustDSS Standard (v1.0)

Tài liệu này là quy chuẩn kỹ thuật bắt buộc cho toàn bộ các nhóm dự án phát triển ứng dụng con (`@intrustdss/intrace`, `@intrustdss/econtract`, `@intrustdss/infarm`, `@intrustdss/ebhxh`...). Mọi mã nguồn mini app trước khi xuất bản thành package nội bộ phải tuân thủ nghiêm ngặt các điều khoản dưới đây.

---

## 1. Cấu trúc Thư mục Chuẩn (Repository Layout)

Mỗi repository của mini-app phải tuân thủ cấu trúc sau:

```
@intrustdss/[mini-app-name]/
├── package.json              # Khai báo peerDependencies, version, entry point
├── tsconfig.json             # Cấu hình TypeScript độc lập của riêng repo
├── .eslintrc.js              # Cấu hình ESLint độc lập cho team
├── .prettierrc               # Cấu hình Prettier đồng bộ code style
├── README.md                 # Tài liệu tính năng & changelog
├── standalone-runner/        # Môi trường chạy kiểm thử độc lập cho riêng team
│   ├── App.tsx               # App test giả lập Host truyền token/env
│   ├── app.json              # Cấu hình Expo cho dev nội bộ
│   └── package.json
└── src/
    ├── index.ts              # FILE QUAN TRỌNG NHẤT: Export Navigator & Types
    ├── config/               # Cấu hình 3 môi trường (dev, uat, prod)
    │   ├── env.dev.ts
    │   ├── env.uat.ts
    │   ├── env.prod.ts
    │   └── env.ts
    ├── components/           # Components UI dùng chung nội bộ
    │   └── [MiniAppName]ErrorBoundary.tsx # BẮT BUỘC
    ├── screens/              # Các màn hình chức năng nghiệp vụ
    ├── navigation/           # Stack Navigator nội bộ của mini app
    ├── services/             # Gọi API, HTTP client, kết nối backend riêng
    ├── hooks/                # Custom hooks tái sử dụng logic nội bộ
    ├── types/                # TypeScript Interfaces, Models, DTOs
    ├── constants/            # Theme màu sắc, kích thước, hằng số nghiệp vụ
    └── utils/                # Các hàm tiện ích, formatters, helpers
```

> **Lưu ý nguyên tắc tách biệt độc lập:** Vì mỗi mini-app là một repository độc lập giao cho một đội ngũ phát triển riêng, toàn bộ file cấu hình (`tsconfig.json`, `.eslintrc.js`, `.prettierrc`) và các tầng mã nguồn (`services`, `hooks`, `types`, `constants`, `utils`) PHẢI được thiết lập khép kín bên trong từng repository của mini app, tuyệt đối không phụ thuộc vào cấu hình ở thư mục cha hay App tổng.

### 1.1. Quy chuẩn Thiết kế Màn hình (Screen Folder Pattern)
> [!IMPORTANT]
> **QUY TẮC CẤM "GOD COMPONENT":** Tuyệt đối không gom chung State, Logic API, Quét mã, Giao diện JSX và StyleSheet vào chung 1 file duy nhất. Mọi màn hình chức năng phải được tổ chức thành thư mục khép kín:
> ```
> screens/[ScreenName]/
> ├── [ScreenName]Screen.tsx    # Chỉ chứa UI JSX layout (dưới 100 dòng)
> ├── use[ScreenName].ts        # Custom Hook quản lý State, Validation, Scanner, API
> ├── [ScreenName].styles.ts    # Tách riêng toàn bộ StyleSheet.create
> └── components/               # Các mảnh giao diện con đặc thù của màn hình
> ```
> - **Lợi ích:** Tránh Git Conflict khi làm việc nhóm, cho phép viết Unit Test độc lập cho tầng Logic, dễ dàng bảo trì và tối ưu hiệu năng render.

---

## 2. Quy tắc Export & Giao tiếp với App Tổng (Contract)

### 2.1. File `src/index.ts` chỉ export những gì cần thiết
Mini-app **không** tự ý export các component nội bộ rải rác. Điểm vào duy nhất (`entry point`) là `src/index.ts`, xuất ra:
1. `[MiniAppName]Navigator`: Component chứa toàn bộ luồng giao diện của app con.
2. `[MiniAppName]Props`: TypeScript Interface quy định các tham số App tổng cần truyền.
3. `[MiniAppName]ErrorBoundary`: Component bao bọc tự bắt lỗi.

### 2.2. Chuẩn Props Interface bắt buộc:
```typescript
export interface MiniAppUserInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  roles?: string[];
}

export type AppEnvironment = 'dev' | 'uat' | 'prod';

export interface BaseMiniAppProps {
  /** Token xác thực Bearer/JWT từ App tổng */
  token: string;
  /** Thông tin định danh người dùng đã đăng nhập */
  userInfo: MiniAppUserInfo;
  /** Môi trường máy chủ cần trỏ tới */
  environment: AppEnvironment;
  /** Tùy chọn giao diện (dark/light) */
  colorScheme?: 'light' | 'dark';
  /** Callback khi người dùng bấm nút Thoát / Về Trang chủ Super App */
  onExit?: () => void;
  /** Callback khi mini app phát hiện token hết hạn 401 */
  onSessionExpired?: () => void;
}
```

---

## 3. Quy định BẮT BUỘC: Xử lý Lỗi với ErrorBoundary

Mỗi mini-app **bắt buộc** phải tự bọc toàn bộ giao diện của mình trong một `ErrorBoundary`.

### Tại sao?
Nếu mini-app bị crash do lỗi JavaScript (ví dụ: `Cannot read properties of undefined`, lỗi parse JSON từ backend...), `ErrorBoundary` của mini app sẽ hiển thị màn hình fallback thân thiện kèm nút **"Thử lại"** hoặc **"Quay về App Tổng"**.
 tuyệt đối **KHÔNG ĐƯỢC** để lỗi JavaScript làm sập (crash văng) cả Super App của người dùng.

---

## 4. Quy tắc Nghiêm ngặt về Thư viện Phụ thuộc (Dependencies)

> [!CAUTION]
> **QUY TẮC SỐ 1: CẤM TỰ TIỆN CÀI THƯ VIỆN CÓ MÃ NATIVE**
> Trong kiến trúc Super App, file nhị phân cài trên điện thoại (APK/AAB/IPA) được build từ App tổng. Nếu mini app cài một thư viện chứa native code (Android/iOS) mà App tổng chưa tích hợp, ứng dụng sẽ crash ngay lập tức khi mở tính năng đó!

### Danh mục thư viện được phép dùng:
1. **Các thư viện Pure JavaScript/TypeScript**:
   - Ví dụ: `axios`, `dayjs`, `lodash`, `zustand`, `zod`.
   - Cài vào mục `"dependencies"` của mini-app.
2. **Các thư viện UI / Native dùng chung**:
   - Ví dụ: `react`, `react-native`, `@react-navigation/native`, `@react-navigation/stack`, `expo-camera`, `expo-image`, `react-native-safe-area-context`, `react-native-gesture-handler`.
   - **BẮT BUỘC** khai báo vào mục `"peerDependencies"` trong `package.json` của mini-app.
   - Không được cài vào `"dependencies"` để tránh bị nhân đôi bundle (duplicate bundle).

---

## 5. Quy chuẩn Quản lý Đa Môi trường (DEV / UAT / PROD)

Mini-app phải cung cấp file cấu hình tương ứng với tham số `environment` nhận được từ Host App:

```typescript
// src/config/env.ts
import { devConfig } from './env.dev';
import { uatConfig } from './env.uat';
import { prodConfig } from './env.prod';
import { AppEnvironment } from '../types';

export const getMiniAppConfig = (env: AppEnvironment = 'dev') => {
  switch (env) {
    case 'prod': return prodConfig;
    case 'uat': return uatConfig;
    case 'dev':
    default: return devConfig;
  }
};
```

---

## 6. Quy trình Phát hành Package (Release Flow)

1. **Kiểm thử độc lập**: Chạy `npm run start` trong thư mục `standalone-runner`.
2. **Build TypeScript**: Chạy `npm run build` để sinh mã JS/d.ts trong thư mục `dist/` (hoặc cấu hình Metro monorepo).
3. **Đánh phiên bản SemVer**: `major.minor.patch` (ví dụ: `1.0.1`).
4. **Publish lên Git/NPM nội bộ**: Đẩy tag git hoặc publish lên Verdaccio/GitHub Packages của intrustDSS.
5. **Thông báo cho team Super App**: Gửi bản cập nhật để App tổng nâng version dependency và phát hành OTA qua EAS Update.
