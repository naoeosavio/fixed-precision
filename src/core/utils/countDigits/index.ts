export function count_digits(value: bigint): number {
  if (value <= 0n) return 0;
  return value.toString().length;
}
