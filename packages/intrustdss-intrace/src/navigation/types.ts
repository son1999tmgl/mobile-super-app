import { Carton } from '../types/carton';
import { Container } from '../types/container';
import { ProductCategory } from '../types/product';

export type InTraceStackParamList = {
  ProductSelect: undefined;
  InTraceDashboard: undefined;
  CartonList: undefined;
  CartonForm: { carton?: Carton; initialCartonCode?: string; product?: ProductCategory } | undefined;
  ContainerList: undefined;
  ContainerForm: { container?: Container; product?: ProductCategory } | undefined;
};
