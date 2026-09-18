export interface EContractDocument {
  id: string;
  documentNumber: string;
  title: string;
  signStatus: 'draft' | 'pending' | 'signed' | 'rejected';
  createdAt: string;
  updatedAt?: string;
}
