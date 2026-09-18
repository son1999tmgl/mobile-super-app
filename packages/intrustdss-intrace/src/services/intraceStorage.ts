import AsyncStorage from '@react-native-async-storage/async-storage';
import { Carton, CreateCartonDto } from '../types/carton';
import { Container, CreateContainerDto } from '../types/container';
import { getInTraceConfig } from '../config/env';
import { InTraceApiService } from './intraceApi';

const STORAGE_KEY_CARTONS = '@intrustdss/intrace/cartons';
const STORAGE_KEY_CONTAINERS = '@intrustdss/intrace/containers';

let activeToken: string | null = null;
let activeEnv: any = 'dev';

// Cache ban đầu mẫu nếu máy chưa từng lưu dữ liệu
const DEFAULT_SEED_CARTONS: Carton[] = [
  {
    id: 'ctn-001',
    cartonCode: 'THUNG-VN-8801',
    productName: 'Nông sản VietGAP',
    lotNumber: 'LOT-2026',
    packingDate: new Date().toISOString(),
    quantity: 12,
    unit: 'sản phẩm',
    status: 'packed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_SEED_CONTAINERS: Container[] = [
  {
    id: 'cnt-001',
    containerCode: 'TCKU-781920-1',
    sealNumber: 'SEAL-VN-9948',
    destination: 'Cảng Cát Lái -> Quốc tế',
    driverName: 'Nguyễn Văn Tuấn',
    truckPlate: '51C-982.11',
    status: 'loading',
    cartonCount: 1,
    maxCartons: 500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const InTraceStorageService = {
  setAuth(token: string, env: any = 'dev') {
    activeToken = token;
    activeEnv = env;
  },

  getApiBaseUrl(): string {
    const config = getInTraceConfig(activeEnv);
    return config.apiBaseUrl;
  },

  getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (activeToken) {
      headers['Authorization'] = `Bearer ${activeToken}`;
    }
    return headers;
  },

  // === ĐỌC / GHI STORAGE BỀN VỮNG (ASYNCSTORAGE) ===
  async readLocalCartons(): Promise<Carton[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_CARTONS);
      if (raw) {
        return JSON.parse(raw) as Carton[];
      }
    } catch (err) {
      console.warn('[inTrace Storage] Lỗi đọc cartons từ máy:', err);
    }
    return [...DEFAULT_SEED_CARTONS];
  },

  async writeLocalCartons(cartons: Carton[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_CARTONS, JSON.stringify(cartons));
    } catch (err) {
      console.warn('[inTrace Storage] Lỗi ghi cartons vào máy:', err);
    }
  },

  async readLocalContainers(): Promise<Container[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_CONTAINERS);
      if (raw) {
        return JSON.parse(raw) as Container[];
      }
    } catch (err) {
      console.warn('[inTrace Storage] Lỗi đọc containers từ máy:', err);
    }
    return [...DEFAULT_SEED_CONTAINERS];
  },

  async writeLocalContainers(containers: Container[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_CONTAINERS, JSON.stringify(containers));
    } catch (err) {
      console.warn('[inTrace Storage] Lỗi ghi containers vào máy:', err);
    }
  },

  // === QUẢN LÝ THÙNG (CARTON / BOX) ===
  async getCartons(): Promise<Carton[]> {
    // 1. Thử lấy từ server
    const remoteCartons = await InTraceApiService.fetchCartons(
      this.getApiBaseUrl(),
      this.getHeaders()
    );

    if (remoteCartons && remoteCartons.length > 0) {
      // Đồng bộ đè vào bộ nhớ máy để dùng khi offline
      await this.writeLocalCartons(remoteCartons);
      return remoteCartons;
    }

    // 2. Nếu offline / server lỗi, đọc dữ liệu bền vững từ máy
    return await this.readLocalCartons();
  },

  async getCartonByCode(code: string): Promise<Carton | undefined> {
    const all = await this.getCartons();
    return all.find((c) => c.cartonCode.toLowerCase() === code.trim().toLowerCase());
  },

  async createCarton(dto: CreateCartonDto & { product_qr_codes?: string[] }): Promise<Carton> {
    // 1. Thử tạo trên server
    const createdRemote = await InTraceApiService.createCarton(
      this.getApiBaseUrl(),
      this.getHeaders(),
      dto
    );

    const localList = await this.readLocalCartons();

    if (createdRemote) {
      const updated = [createdRemote, ...localList.filter((c) => c.id !== createdRemote.id)];
      await this.writeLocalCartons(updated);
      return createdRemote;
    }

    // 2. Offline fallback: lưu bản ghi vào bộ nhớ máy
    const offlineCarton: Carton = {
      id: `offline-ctn-${Date.now()}`,
      cartonCode: dto.cartonCode,
      productName: dto.productName || 'Sản phẩm inTrace',
      lotNumber: dto.lotNumber || 'LOT-2026',
      packingDate: dto.packingDate || new Date().toISOString(),
      quantity: dto.quantity || dto.product_qr_codes?.length || 0,
      unit: dto.unit || 'sản phẩm',
      status: 'packed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [offlineCarton, ...localList];
    await this.writeLocalCartons(updated);
    return offlineCarton;
  },

  async deleteCarton(id: string): Promise<boolean> {
    await InTraceApiService.deleteCarton(this.getApiBaseUrl(), this.getHeaders(), id);
    const localList = await this.readLocalCartons();
    const updated = localList.filter((c) => c.id !== id);
    await this.writeLocalCartons(updated);
    return true;
  },

  // === QUẢN LÝ CÔNG (CONTAINER) ===
  async getContainers(): Promise<Container[]> {
    // 1. Thử lấy từ server
    const remoteContainers = await InTraceApiService.fetchContainers(
      this.getApiBaseUrl(),
      this.getHeaders()
    );

    if (remoteContainers && remoteContainers.length > 0) {
      await this.writeLocalContainers(remoteContainers);
      return remoteContainers;
    }

    // 2. Offline fallback
    return await this.readLocalContainers();
  },

  async createContainer(dto: CreateContainerDto & { json_boxes?: any[] }): Promise<Container> {
    // 1. Thử tạo trên server
    const createdRemote = await InTraceApiService.createContainer(
      this.getApiBaseUrl(),
      this.getHeaders(),
      dto
    );

    const localList = await this.readLocalContainers();

    if (createdRemote) {
      const updated = [createdRemote, ...localList.filter((c) => c.id !== createdRemote.id)];
      await this.writeLocalContainers(updated);
      return createdRemote;
    }

    // 2. Offline fallback: lưu bản ghi vào bộ nhớ máy
    const offlineContainer: Container = {
      id: `offline-cnt-${Date.now()}`,
      containerCode: dto.containerCode,
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

    const updated = [offlineContainer, ...localList];
    await this.writeLocalContainers(updated);
    return offlineContainer;
  },

  async deleteContainer(id: string): Promise<boolean> {
    await InTraceApiService.deleteContainer(this.getApiBaseUrl(), this.getHeaders(), id);
    const localList = await this.readLocalContainers();
    const updated = localList.filter((c) => c.id !== id);
    await this.writeLocalContainers(updated);
    return true;
  },

  async getUnassignedCartons(): Promise<Carton[]> {
    const cartons = await this.getCartons();
    return cartons.filter((c) => !c.containerId);
  },
};
