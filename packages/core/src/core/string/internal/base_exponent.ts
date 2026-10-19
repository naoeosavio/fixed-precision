function bit_length(value: bigint): number {
  if (value === 0n) return 0;
  return value.toString(2).length;
}

export function base_exponent(
  value: bigint,
  scale: bigint,
  radix: 2 | 8 | 16,
): number {
  const abs_value = value < 0n ? -value : value;
  const integer_part = abs_value / scale;
  const k = radix === 2 ? 1 : radix === 8 ? 3 : 4;

  if (integer_part > 0n) {
    const bits = bit_length(integer_part);
    return radix === 2 ? bits - 1 : Math.ceil(bits / k) - 1;
  }

  const value_bits = bit_length(abs_value);
  const scale_bits = bit_length(scale);
  let exponent = Math.ceil((scale_bits - value_bits) / k) - 1;
  if (exponent < 0) exponent = 0;

  let scaled = abs_value << BigInt(exponent * k);
  while (scaled < scale) {
    scaled <<= BigInt(k);
    exponent += 1;
  }

  return -exponent;
}
