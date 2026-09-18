import { Carton } from '../types/carton';
import { Container } from '../types/container';

export type InTraceStackParamList = {
  InTraceDashboard: undefined;
  CartonList: undefined;
  CartonForm: { carton?: Carton; initialCartonCode?: string } | undefined;
  ContainerList: undefined;
  ContainerForm: { container?: Container } | undefined;
};
