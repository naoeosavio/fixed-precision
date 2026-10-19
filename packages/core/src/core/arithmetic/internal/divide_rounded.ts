export function divide_rounded(value: bigint, divisor: bigint): bigint {
  if (value >= 0n) {
    return (2n * value + divisor) / (2n * divisor);
  }
  return -divide_rounded(-value, divisor);
}
