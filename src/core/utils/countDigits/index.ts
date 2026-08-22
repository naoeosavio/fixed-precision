export function count_digits(value: bigint): number {
  if (value === 0n) return 0;
  let count = 0;
  while (value > 0n) {
    value = value / 10n;
    count++;
  }
  return count;
}
