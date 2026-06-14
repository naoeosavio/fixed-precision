export function round_half_up_scaled_value(
  value: bigint,
  factor: bigint,
): bigint {
  const q = value / factor;
  const base = q * factor;
  const rem = value - base;
  if (rem === 0n) {
    return value;
  }

  const twice_abs_rem = rem < 0n ? -rem << 1n : rem << 1n;
  if (twice_abs_rem < factor) {
    return base;
  }
  return value > 0n ? base + factor : base - factor;
}
