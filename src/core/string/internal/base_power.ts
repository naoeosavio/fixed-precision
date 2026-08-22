export function base_power(radix: 2 | 8 | 16, exponent: number): bigint {
  return BigInt(radix) ** BigInt(exponent);
}
