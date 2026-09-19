export interface ProductCategory {
  id: string; // product_category_config_id hoặc product_category_id
  config_id?: string; // product_category_config_id (pccid trên web)
  product_category_id?: string; // product_category_id gốc (pcid trên web)
  code?: string; // Mã cấu hình sản phẩm: AAA-26187, AAA-29287...
  name: string; // Tên sản phẩm: Sầu riêng, Chè đóng gói...
  gtin_code?: string;
  gtin?: string;
  image_url?: string | null;
  excerpt?: string;
  description?: string;
  status?: number;
  is_boxing?: boolean;
  boxing_level?: number;
  use_container_stamp?: boolean;
  has_importing_records?: boolean;
  created_at?: string;
  updated_at?: string;
}

