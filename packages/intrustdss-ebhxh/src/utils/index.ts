/**
 * Hàm tiện ích nội bộ cho eBHXH
 */

export function formatMonthYear(month: number, year: number): string {
  const m = month < 10 ? `0${month}` : `${month}`;
  return `Kỳ kê khai: ${m}/${year}`;
}
