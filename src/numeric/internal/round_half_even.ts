export function round_half_even(
  q: bigint,
  rem: bigint,
  factor: bigint,
  is_positive: boolean,
): bigint {
  const twice_abs_rem = (rem < 0n ? -rem : rem) << 1n;
  if (twice_abs_rem === factor) {
    return q % 2n === 0n ? q : is_positive ? q + 1n : q - 1n;
  }
  return twice_abs_rem > factor ? (is_positive ? q + 1n : q - 1n) : q;
}
