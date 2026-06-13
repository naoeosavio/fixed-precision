export function divide_rounded(value: bigint, divisor: bigint): bigint {
  if (value >= 0n) {
    return (value + divisor / 2n) / divisor;
  }
  return -((-value + divisor / 2n) / divisor);
}
