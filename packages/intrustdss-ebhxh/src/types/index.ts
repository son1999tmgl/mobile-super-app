export interface BhxhDeclaration {
  id: string;
  declarationCode: string;
  month: number;
  year: number;
  totalEmployees: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}
