/**
 * Tiện ích dùng chung cho mini-app inTrace
 */

export function formatDateTime(isoString?: string): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleString('vi-VN');
}
