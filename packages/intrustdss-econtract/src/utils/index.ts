/**
 * Hàm tiện ích nội bộ cho eContract
 */

export function formatContractStatus(status: string): string {
  switch (status) {
    case 'signed':
      return 'Đã ký';
    case 'pending':
      return 'Chờ ký';
    case 'rejected':
      return 'Từ chối';
    default:
      return 'Bản nháp';
  }
}
