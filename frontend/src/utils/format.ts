export function formatNumber(value: number | undefined | null, digit = 4): string {
  const number = Number(value || 0);
  if (Number.isNaN(number)) return '0,0000';
  return number.toFixed(digit).replace('.', ',');
}

export function statusClass(status: string): string {
  if (status === 'Sangat Layak' || status === 'Layak' || status === 'Sudah Dinilai') return 'success';
  if (status === 'Dipertimbangkan') return 'warning';
  if (status === 'Tidak Layak') return 'danger';
  return 'muted';
}
