import { Carton, CreateCartonDto } from '../types/carton';
import { Container, CreateContainerDto } from '../types/container';
import { ProductCategory } from '../types/product';
import { HttpFilterBuilder } from '../utils/httpFilterBuilder';

/**
 * Module chuyên trách giao tiếp HTTP API với máy chủ inTrace Backend
 */
export const InTraceApiService = {
  // === API DANH MỤC & CẤU HÌNH SẢN PHẨM (PRODUCT CATEGORY CONFIGS) ===
  async fetchProductCategories(
    apiBaseUrl: string,
    headers: Record<string, string>
  ): Promise<ProductCategory[]> {
    // 1. Ưu tiên gọi /product-category-configs (Chuẩn Web inTrace)
    try {
      const configUrl = `${apiBaseUrl}/product-category-configs?includes[]=image&includes[]=productCategory&filter_groups[0][filters][0][key]=status&filter_groups[0][filters][0][value]=1&limit=100&page=1`;
      const res = await fetch(configUrl, { method: 'GET', headers });
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && json.data) {
          const rawList =
            json.data?.product_category_configs?.product_category_configs ||
            json.data?.product_category_configs ||
            (Array.isArray(json.data) ? json.data : []);

          if (Array.isArray(rawList) && rawList.length > 0) {
            return rawList.map((item: any) => ({
              id: String(item.id || item._id),
              config_id: String(item.id || item._id),
              product_category_id: String(item.product_category_id || item.productCategory?.id || item.id),
              code: item.code || item.productCategory?.code || '',
              name: item.name || item.productCategory?.name || 'Sản phẩm inTrace',
              gtin_code: item.gtin_code || item.productCategory?.gtin_code || item.gtin || '',
              image_url: item.image?.file_server_url || item.image_url || null,
              excerpt: item.excerpt || item.description || '',
              description: item.description || '',
              status: item.status ?? 1,
              is_boxing: item.is_boxing !== undefined ? Boolean(item.is_boxing) : true,
              has_importing_records: Boolean(item.has_importing_records),
              boxing_level: item.boxing_level ?? item.productCategory?.boxing_level ?? 1,
              use_container_stamp: item.use_container_stamp !== undefined ? Boolean(item.use_container_stamp) : true,
              created_at: item.created_at,
              updated_at: item.updated_at,
            }));
          }
        } else if (json.status === 'error' || json.message) {
          console.warn(`[inTrace API] /product-category-configs trả về lỗi [${json.code}]: ${json.message}`);
        }
      } else {
        console.warn(`[inTrace API] /product-category-configs lỗi HTTP: ${res.status}`);
      }
    } catch (err) {
      console.warn('[inTrace API] Thử tải /product-category-configs thất bại, chuyển sang fallback:', err);
    }

    // 2. Fallback: gọi danh mục gốc /product-categories nếu endpoint cấu hình không có dữ liệu
    try {
      const url = `${apiBaseUrl}/product-categories?limit=100&page=1`;
      const res = await fetch(url, { method: 'GET', headers });
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && json.data) {
          const rawList =
            json.data?.product_categories?.product_categories ||
            json.data?.product_categories ||
            (Array.isArray(json.data) ? json.data : []);

          if (Array.isArray(rawList) && rawList.length > 0) {
            return rawList.map((item: any) => ({
              id: String(item.id || item._id),
              config_id: String(item.id || item._id),
              product_category_id: String(item.id || item._id),
              code: item.code || '',
              name: item.name || 'Sản phẩm không tên',
              gtin_code: item.gtin_code || item.gtin || '',
              image_url: item.image?.file_server_url || item.image_url || null,
              excerpt: item.excerpt || '',
              description: item.description || '',
              status: item.status ?? 1,
              is_boxing: item.is_boxing ?? true,
              boxing_level: item.boxing_level ?? 1,
              use_container_stamp: item.use_container_stamp ?? true,
              created_at: item.created_at,
              updated_at: item.updated_at,
            }));
          }
        }
      }
    } catch (err) {
      console.warn('[inTrace API] Lỗi tải danh mục sản phẩm fallback:', err);
    }
    return [];
  },

  // === API THÙNG HÀNG (BOXES) ===
  async fetchCartons(
    apiBaseUrl: string,
    headers: Record<string, string>,
    productCategoryId?: string,
    productCategoryConfigId?: string
  ): Promise<Carton[] | null> {
    try {
      const builder = new HttpFilterBuilder(5555);
      builder.setPagination(100, 1);
      builder.addSort('created_at', 'DESC', 10);

      const targetConfigId = productCategoryConfigId || productCategoryId;
      if (targetConfigId) {
        builder.append('product_category_config_id', targetConfigId, 'eq');
      }

      const url = builder.buildUrl(`${apiBaseUrl}/boxes`);
      const res = await fetch(url, { method: 'GET', headers });
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && json.data) {
          const rawList =
            json.data?.boxes?.boxes ||
            json.data?.boxes ||
            (Array.isArray(json.data) ? json.data : []);

          if (Array.isArray(rawList)) {
            return rawList.map((item: any) => ({
              id: String(item.id || item._id),
              cartonCode: item.code || item.cartonCode || `THUNG-${item.id}`,
              productName:
                item.product_category_config?.name ||
                item.productCategory?.name ||
                item.product_name ||
                item.name ||
                'Sản phẩm inTrace',
              product_category_id:
                item.product_category_id ||
                item.productCategory?.id ||
                productCategoryId ||
                null,
              product_category_config_id:
                item.product_category_config_id ||
                item.product_category_config?.id ||
                productCategoryConfigId ||
                null,
              lotNumber: item.lot_code || item.lotNumber || 'LOT-2026',
              packingDate: item.created_at || item.packing_date || new Date().toISOString(),
              quantity: item.product_quantity ?? item.product_qr_codes?.length ?? 0,
              unit: 'sản phẩm',
              status: item.container_id || item.container?.code ? 'loaded' : 'packed',
              containerCode: item.container?.code || item.container_code || null,
              store_status: item.store_status ?? 0,
              createdAt: item.created_at || new Date().toISOString(),
              updatedAt: item.updated_at || new Date().toISOString(),
            }));
          }
        } else if (json.status === 'error' || json.message) {
          console.warn(`[inTrace API] /boxes trả về lỗi [${json.code}]: ${json.message}`);
        }
      } else {
        console.warn(`[inTrace API] /boxes lỗi HTTP: ${res.status}`);
      }
    } catch (err) {
      console.warn('[inTrace API] Không thể tải danh sách thùng từ server:', err);
    }
    return null;
  },

  async createCarton(
    apiBaseUrl: string,
    headers: Record<string, string>,
    dto: CreateCartonDto & { product_qr_codes?: string[] }
  ): Promise<Carton | null> {
    try {
      const url = `${apiBaseUrl}/boxes`;
      const payload: any = {
        code: dto.cartonCode,
        product_quantity: dto.quantity || dto.product_qr_codes?.length || 0,
        product_qr_codes: dto.product_qr_codes || [],
        skip_to_redundancy: true,
      };

      if (dto.product_category_id) {
        payload.product_category_id = dto.product_category_id;
      }
      if (dto.product_category_config_id) {
        payload.product_category_config_id = dto.product_category_config_id;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && json.data) {
          const item = json.data;
          return {
            id: String(item.id || Date.now()),
            cartonCode: item.code || dto.cartonCode,
            productName: dto.productName || 'Sản phẩm inTrace',
            product_category_id: item.product_category_id || dto.product_category_id || null,
            lotNumber: dto.lotNumber || 'LOT-2026',
            packingDate: dto.packingDate || new Date().toISOString(),
            quantity: dto.quantity || dto.product_qr_codes?.length || 0,
            unit: dto.unit || 'sản phẩm',
            status: 'packed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
      }
    } catch (err) {
      console.warn('[inTrace API] Không thể tạo thùng trên server:', err);
    }
    return null;
  },

  async deleteCarton(apiBaseUrl: string, headers: Record<string, string>, id: string): Promise<boolean> {
    try {
      const res = await fetch(`${apiBaseUrl}/boxes/${id}`, {
        method: 'DELETE',
        headers,
      });
      return res.ok;
    } catch (err) {
      console.warn('[inTrace API] Lỗi xóa thùng trên server:', err);
      return false;
    }
  },

  // === API CÔNG (CONTAINERS) ===
  async fetchContainers(
    apiBaseUrl: string,
    headers: Record<string, string>,
    productCategoryConfigId?: string
  ): Promise<Container[] | null> {
    try {
      const builder = new HttpFilterBuilder(3000);
      builder.setPagination(50, 1);
      builder.addSort('created_at', 'DESC', 0);
      builder.addInclude('testingResult');

      if (productCategoryConfigId) {
        builder.append('product_category_config_id', productCategoryConfigId, 'eq');
      }

      const url = builder.buildUrl(`${apiBaseUrl}/containers`);
      const res = await fetch(url, { method: 'GET', headers });
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && json.data) {
          const rawList =
            json.data?.containers?.containers ||
            json.data?.containers ||
            (Array.isArray(json.data) ? json.data : []);

          if (Array.isArray(rawList)) {
            return rawList.map((item: any) => ({
              id: String(item.id || item._id),
              containerCode: item.code || item.containerCode || item.lot_code || `CONT-${item.id}`,
              sealNumber: item.seal_number || item.code || 'SEAL-DEFAULT',
              destination: item.destination || 'Nội địa / Xuất khẩu',
              driverName: item.driver_name || 'Tài xế vận tải',
              truckPlate: item.truck_plate || 'Chưa gán',
              status: item.status || 'loading',
              cartonCount: item.box_quantity ?? item.boxes_count ?? item.json_boxes?.length ?? 0,
              maxCartons: item.max_cartons || 800,
              lotCode: item.lot_code || item.code,
              productQuantity: item.product_quantity ?? 0,
              farmerQuantity: item.farmer_quantity ?? 0,
              productName:
                item.productCategory?.name ||
                item.product_category_name ||
                item.product_name ||
                'Sản phẩm inTrace',
              testingResult: item.testingResult || item.testing_result || null,
              createdAt: item.created_at || new Date().toISOString(),
              updatedAt: item.updated_at || new Date().toISOString(),
            }));
          }
        } else if (json.status === 'error' || json.message) {
          console.warn(`[inTrace API] /containers trả về lỗi [${json.code}]: ${json.message}`);
        }
      } else {
        console.warn(`[inTrace API] /containers lỗi HTTP: ${res.status}`);
      }
    } catch (err) {
      console.warn('[inTrace API] Không thể tải danh sách container từ server:', err);
    }
    return null;
  },

  async createContainer(
    apiBaseUrl: string,
    headers: Record<string, string>,
    dto: CreateContainerDto & { json_boxes?: any[] }
  ): Promise<Container | null> {
    try {
      const url = `${apiBaseUrl}/containers`;
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          code: dto.containerCode,
          seal_number: dto.sealNumber,
          box_quantity: dto.json_boxes?.length || 0,
          json_boxes: dto.json_boxes || [],
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && json.data) {
          const item = json.data;
          return {
            id: String(item.id || Date.now()),
            containerCode: item.code || dto.containerCode,
            sealNumber: dto.sealNumber || 'SEAL-DEFAULT',
            destination: dto.destination || 'Kho vận',
            driverName: dto.driverName || 'Chưa gán',
            truckPlate: dto.truckPlate || 'Chưa gán',
            status: 'loading',
            cartonCount: dto.json_boxes?.length || 0,
            maxCartons: 800,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
      }
    } catch (err) {
      console.warn('[inTrace API] Không thể tạo container trên server:', err);
    }
    return null;
  },

  async deleteContainer(apiBaseUrl: string, headers: Record<string, string>, id: string): Promise<boolean> {
    try {
      const res = await fetch(`${apiBaseUrl}/containers/${id}`, {
        method: 'DELETE',
        headers,
      });
      return res.ok;
    } catch (err) {
      console.warn('[inTrace API] Lỗi xóa container trên server:', err);
      return false;
    }
  },
};
