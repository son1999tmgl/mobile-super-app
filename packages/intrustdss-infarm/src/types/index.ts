export interface FarmZone {
  id: string;
  name: string;
  cropType: string;
  areaSquareMeters: number;
  status: 'planting' | 'harvesting' | 'fallow';
}
