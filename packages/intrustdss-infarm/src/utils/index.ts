/**
 * Hàm tiện ích nội bộ cho inFarm
 */

export function formatArea(squareMeters: number): string {
  if (squareMeters >= 10000) {
    return `${(squareMeters / 10000).toFixed(1)} ha`;
  }
  return `${squareMeters} m²`;
}
