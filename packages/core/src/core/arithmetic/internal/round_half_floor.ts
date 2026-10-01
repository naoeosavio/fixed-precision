export function round_half_floor(
  q: bigint,
  rem: bigint,
  factor: bigint,
  is_positive: boolean,
): bigint {
  const twice_abs_rem = (rem < 0n ? -rem : rem) << 1n;
  if (is_positive) {
    return twice_abs_rem > factor ? q + 1n : q;
  }
  return twice_abs_rem >= factor ? q - 1n : q;
}
