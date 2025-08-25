export function formatRupiah(value: number): string {
  return value.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2
  });
}