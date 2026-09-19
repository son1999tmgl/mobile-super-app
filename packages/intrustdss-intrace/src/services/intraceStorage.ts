import AsyncStorage from '@react-native-async-storage/async-storage';
import { Carton, CreateCartonDto } from '../types/carton';
import { Container, CreateContainerDto } from '../types/container';
import { ProductCategory } from '../types/product';
import { getInTraceConfig } from '../config/env';
import { InTraceApiService } from './intraceApi';

const STORAGE_KEY_PRODUCTS = '@intrustdss/intrace/products';
const STORAGE_KEY_SELECTED_PRODUCT = '@intrustdss/intrace/selected_product';
const STORAGE_KEY_CARTONS = '@intrustdss/intrace/cartons';
const STORAGE_KEY_CONTAINERS = '@intrustdss/intrace/containers';
const STORAGE_KEY_TAX_CODE = '@intrustdss/intrace/tax_code';
const STORAGE_KEY_ACCOUNT_ID = '@intrustdss/intrace/account_id';

let activeToken: string | null = null;
let activeEnv: any = 'dev';
let activeCustomBaseUrl: string | null = null;
let activeTaxCode: string | null = null;
let activeAccountId: string | null = null;
let activeSelectedProduct: ProductCategory | null = null;

export const InTraceStorageService = {
  async init(): Promise<void> {
    try {
      if (!activeTaxCode) {
        const storedTax = await AsyncStorage.getItem(STORAGE_KEY_TAX_CODE);
        if (storedTax) activeTaxCode = storedTax;
      }
      if (!activeAccountId) {
        const storedAcc = await AsyncStorage.getItem(STORAGE_KEY_ACCOUNT_ID);
        if (storedAcc) activeAccountId = storedAcc;
      }
      if (!activeSelectedProduct) {
        activeSelectedProduct = await this.getSelectedProduct();
      }
    } catch (err) {
      console.warn('[inTrace Storage] Init error:', err);
    }
  },

  setAuth(
    token: string,
    env: any = 'dev',
    customApiBaseUrl?: string,
    taxCode?: string,
    accountId?: string
  ) {
    activeToken = token;
    activeEnv = env;
    if (customApiBaseUrl) {
      activeCustomBaseUrl = customApiBaseUrl;
    }
    if (taxCode) {
      activeTaxCode = taxCode;
      AsyncStorage.setItem(STORAGE_KEY_TAX_CODE, taxCode).catch(() => {});
    }
    if (accountId) {
      activeAccountId = accountId;
      AsyncStorage.setItem(STORAGE_KEY_ACCOUNT_ID, accountId).catch(() => {});
    }
  },

  getApiBaseUrl(): string {
    if (activeCustomBaseUrl) {
      return activeCustomBaseUrl;
    }
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
    if (activeTaxCode) {
      headers['taxCode'] = activeTaxCode;
    }
    if (activeAccountId) {
      headers['AccountId'] = activeAccountId;
    }
    if (activeSelectedProduct) {
      const pcid = activeSelectedProduct.product_category_id || activeSelectedProduct.id;
      if (pcid) headers['pcid'] = String(pcid);
      const pccid = activeSelectedProduct.config_id || activeSelectedProduct.id;
      if (pccid) headers['pccid'] = String(pccid);
    }
    return headers;
  },

  // === QUẢN LÝ SẢN PHẨM (PRODUCT CATEGORIES - DỮ LIỆU THẬT) ===
  async getProductCategories(): Promise<ProductCategory[]> {
    await this.init();
    // 1. Tải danh mục sản phẩm từ server backend thật
    const remoteList = await InTraceApiService.fetchProductCategories(
      this.getApiBaseUrl(),
      this.getHeaders()
    );

    if (remoteList && remoteList.length > 0) {
      await AsyncStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(remoteList));
      return remoteList;
    }

    // 2. Offline fallback: đọc từ bộ nhớ máy
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (raw) {
        return JSON.parse(raw) as ProductCategory[];
      }
    } catch (e) {
      console.warn('[inTrace Storage] Lỗi đọc products offline:', e);
    }
    return [];
  },

  async setSelectedProduct(product: ProductCategory | null): Promise<void> {
    activeSelectedProduct = product;
    try {
      if (product) {
        await AsyncStorage.setItem(STORAGE_KEY_SELECTED_PRODUCT, JSON.stringify(product));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY_SELECTED_PRODUCT);
      }
    } catch (e) {
      console.warn('[inTrace Storage] Lỗi lưu selected product:', e);
    }
  },

  async getSelectedProduct(): Promise<ProductCategory | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_SELECTED_PRODUCT);
      if (raw) {
        return JSON.parse(raw) as ProductCategory;
      }
    } catch (e) {
      console.warn('[inTrace Storage] Lỗi đọc selected product:', e);
    }
    return null;
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
    return [];
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
    return [];
  },

  async writeLocalContainers(containers: Container[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_CONTAINERS, JSON.stringify(containers));
    } catch (err) {
      console.warn('[inTrace Storage] Lỗi ghi containers vào máy:', err);
    }
  },

  // === QUẢN LÝ THÙNG (CARTON / BOX) ===
  async getCartons(productCategoryId?: string, productCategoryConfigId?: string): Promise<Carton[]> {
    await this.init();
    const configId =
      productCategoryConfigId ||
      activeSelectedProduct?.config_id ||
      (productCategoryId && productCategoryId.length > 20 ? productCategoryId : undefined);
    const categoryId = productCategoryId || activeSelectedProduct?.product_category_id;

    // 1. Lấy từ server theo chuẩn Bruno query
    const remoteCartons = await InTraceApiService.fetchCartons(
      this.getApiBaseUrl(),
      this.getHeaders(),
      categoryId,
      configId
    );

    if (remoteCartons && remoteCartons.length > 0) {
      await this.writeLocalCartons(remoteCartons);
      return remoteCartons;
    }

    // 2. Offline fallback từ storage
    const local = await this.readLocalCartons();
    if (configId || categoryId) {
      return local.filter(
        (c) =>
          (configId && (c.product_category_config_id === configId || c.product_category_id === configId)) ||
          (categoryId && c.product_category_id === categoryId)
      );
    }
    return local;
  },

  async getCartonByCode(code: string): Promise<Carton | undefined> {
    const all = await this.getCartons();
    return all.find((c) => c.cartonCode.toLowerCase() === code.trim().toLowerCase());
  },

  async createCarton(dto: CreateCartonDto & { product_qr_codes?: string[] }): Promise<Carton> {
    await this.init();
    // Gán product_category_id của sản phẩm đang chọn nếu DTO chưa có
    let finalDto = { ...dto };
    if (!finalDto.product_category_id) {
      const selected = await this.getSelectedProduct();
      if (selected) {
        finalDto.product_category_id = selected.product_category_id || selected.id;
        finalDto.product_category_config_id = selected.config_id || selected.id;
        if (!finalDto.productName || finalDto.productName.includes('inTrace')) {
          finalDto.productName = selected.name;
        }
      }
    }

    // 1. Tạo trên server
    const createdRemote = await InTraceApiService.createCarton(
      this.getApiBaseUrl(),
      this.getHeaders(),
      finalDto
    );

    const localList = await this.readLocalCartons();

    if (createdRemote) {
      const updated = [createdRemote, ...localList.filter((c) => c.id !== createdRemote.id)];
      await this.writeLocalCartons(updated);
      return createdRemote;
    }

    // 2. Offline fallback
    const offlineCarton: Carton = {
      id: `offline-ctn-${Date.now()}`,
      cartonCode: finalDto.cartonCode,
      productName: finalDto.productName || 'Sản phẩm inTrace',
      product_category_id: finalDto.product_category_id || null,
      product_category_config_id: finalDto.product_category_config_id || null,
      lotNumber: finalDto.lotNumber || 'LOT-2026',
      packingDate: finalDto.packingDate || new Date().toISOString(),
      quantity: finalDto.quantity || finalDto.product_qr_codes?.length || 0,
      unit: finalDto.unit || 'sản phẩm',
      status: 'packed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [offlineCarton, ...localList];
    await this.writeLocalCartons(updated);
    return offlineCarton;
  },

  async deleteCarton(id: string): Promise<boolean> {
    await this.init();
    await InTraceApiService.deleteCarton(this.getApiBaseUrl(), this.getHeaders(), id);
    const localList = await this.readLocalCartons();
    const updated = localList.filter((c) => c.id !== id);
    await this.writeLocalCartons(updated);
    return true;
  },

  // === QUẢN LÝ CÔNG (CONTAINER) ===
  async getContainers(productCategoryConfigId?: string): Promise<Container[]> {
    await this.init();
    const configId = productCategoryConfigId || activeSelectedProduct?.config_id;
    const remoteContainers = await InTraceApiService.fetchContainers(
      this.getApiBaseUrl(),
      this.getHeaders(),
      configId
    );

    if (remoteContainers && remoteContainers.length > 0) {
      await this.writeLocalContainers(remoteContainers);
      return remoteContainers;
    }

    return await this.readLocalContainers();
  },

  async createContainer(dto: CreateContainerDto & { json_boxes?: any[] }): Promise<Container> {
    await this.init();
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

  async getUnassignedCartons(productCategoryId?: string, productCategoryConfigId?: string): Promise<Carton[]> {
    const cartons = await this.getCartons(productCategoryId, productCategoryConfigId);
    return cartons.filter((c) => !c.containerId);
  },
};
