export type ContainerStatus = 'draft' | 'loading' | 'sealed' | 'departed';

export interface Container {
  id: string;
  containerCode: string; // Số hiệu container (Ví dụ: TCKU9876543)
  sealNumber: string; // Số chì / Seal bảo vệ
  destination: string; // Điểm đến / Cảng nhận
  driverName?: string; // Tên tài xế
  truckPlate?: string; // Biển số xe kéo
  status: ContainerStatus;
  cartonCount: number; // Số lượng thùng đã xếp vào
  maxCartons?: number; // Sức chứa tối đa (nếu có)
  departureDate?: string; // Ngày dự kiến xuất
  note?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateContainerDto = Omit<Container, 'id' | 'cartonCount' | 'createdAt' | 'updatedAt'>;
export type UpdateContainerDto = Partial<CreateContainerDto>;
