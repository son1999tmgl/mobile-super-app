import { Carton, CreateCartonDto } from '../types/carton';
import { Container, CreateContainerDto } from '../types/container';

/**
 * Module chuyên trách giao tiếp HTTP API với máy chủ inTrace Backend
 */
export const InTraceApiService = {
  // === API THÙNG HÀNG (BOXES) ===
  async fetchCartons(apiBaseUrl: string, headers: Record<string, string>): Promise<Carton[] | null> {
    try {
      const url = `${apiBaseUrl}/boxes?limit=50&page=1`;
      const res = await fetch(url, { method: 'GET', headers });
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && Array.isArray(json.data)) {
          return json.data.map((item: any) => ({
            id: String(item.id || item._id),
            cartonCode: item.code || item.cartonCode || `THUNG-${item.id}`,
            productName: item.product_name || item.name || 'Sản phẩm inTrace',
            lotNumber: item.lot_code || item.lotNumber || 'LOT-2026',
            packingDate: item.packing_date || item.created_at || new Date().toISOString(),
            quantity: item.product_quantity || item.product_qr_codes?.length || 0,
            unit: 'sản phẩm',
            status: item.container_id ? 'loaded' : 'packed',
            containerCode: item.container_code || null,
            createdAt: item.created_at || new Date().toISOString(),
            updatedAt: item.updated_at || new Date().toISOString(),
          }));
        }
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
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          code: dto.cartonCode,
          product_quantity: dto.quantity || dto.product_qr_codes?.length || 0,
          product_qr_codes: dto.product_qr_codes || [],
          skip_to_redundancy: true,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && json.data) {
          const item = json.data;
          return {
            id: String(item.id || Date.now()),
            cartonCode: item.code || dto.cartonCode,
            productName: dto.productName || 'Sản phẩm inTrace',
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
  async fetchContainers(apiBaseUrl: string, headers: Record<string, string>): Promise<Container[] | null> {
    try {
      const url = `${apiBaseUrl}/containers?limit=50&page=1`;
      const res = await fetch(url, { method: 'GET', headers });
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && Array.isArray(json.data)) {
          return json.data.map((item: any) => ({
            id: String(item.id || item._id),
            containerCode: item.code || item.containerCode || `CONT-${item.id}`,
            sealNumber: item.seal_number || 'SEAL-DEFAULT',
            destination: item.destination || 'Nội địa / Xuất khẩu',
            driverName: item.driver_name || 'Tài xế vận tải',
            truckPlate: item.truck_plate || 'Chưa gán',
            status: item.status || 'loading',
            cartonCount: item.box_quantity || item.json_boxes?.length || 0,
            maxCartons: item.max_cartons || 800,
            createdAt: item.created_at || new Date().toISOString(),
            updatedAt: item.updated_at || new Date().toISOString(),
          }));
        }
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
