export function base_exponent(
  value: bigint,
  scale: bigint,
  radix: 2 | 8 | 16,
): number {
  const abs_value = value < 0n ? -value : value;
  const integer_part = abs_value / scale;

  if (integer_part > 0n) {
    return integer_part.toString(radix).length - 1;
  }

  let scaled = abs_value;
  let exponent = 0;
  const base = BigInt(radix);

  while (scaled < scale) {
    scaled *= base;
    exponent -= 1;
  }

  return exponent;
}
