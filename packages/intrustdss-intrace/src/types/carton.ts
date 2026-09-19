export type CartonStatus = 'draft' | 'packed' | 'loaded' | 'shipped';

export interface Carton {
  id: string;
  cartonCode: string; // Mã vạch / QR của thùng
  productName: string; // Tên sản phẩm trong thùng
  product_category_id?: string | null; // ID danh mục sản phẩm thật
  product_category_config_id?: string | null; // ID cấu hình sản phẩm thật
  lotNumber: string; // Mã lô sản xuất
  quantity: number; // Số lượng đơn vị trong thùng
  unit: string; // Đơn vị tính (kg, gói, hộp)
  weightKg?: number; // Khối lượng
  packingDate: string; // Ngày đóng thùng (ISO string)
  containerId?: string | null; // ID container chứa thùng này (nếu có)
  containerCode?: string | null; // Mã công chứa (để hiển thị nhanh)
  status: CartonStatus;
  store_status?: number; // 1 = Lỗi lưu thùng, khác = Hợp lệ
  note?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateCartonDto = Omit<Carton, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCartonDto = Partial<CreateCartonDto>;
