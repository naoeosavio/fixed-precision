export function divide_rounded(value: bigint, divisor: bigint): bigint {
  if (value >= 0n) {
    return (value + divisor) / 2n / divisor;
  } else {
    return -((-value + divisor) / 2n / divisor);
  }
}
