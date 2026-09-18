/**
 * Tiện ích định dạng dữ liệu cho Super App
 */

export function sanitizeInput(value: string): string {
  return value.trim();
}

export function isValidTaxCode(taxCode: string): boolean {
  const cleaned = taxCode.trim();
  // Mã số thuế chuẩn VN: 10 chữ số hoặc 13 chữ số (10 số + gạch ngang + 3 số)
  return /^[0-9]{10}(-[0-9]{3})?$/.test(cleaned) || cleaned.length >= 8;
}
