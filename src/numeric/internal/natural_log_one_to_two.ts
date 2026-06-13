import { MAX_SERIES_ITERATIONS } from "./ln_constants";

export function natural_log_one_to_two(value: bigint, scale: bigint): bigint {
  const z = ((value - scale) * scale) / (value + scale);
  const z_squared = (z * z) / scale;
  let term = z;
  let sum = 0n;
  let divisor = 1n;

  for (
    let index = 0n;
    index < MAX_SERIES_ITERATIONS && term !== 0n;
    index += 1n
  ) {
    sum += term / divisor;
    term = (term * z_squared) / scale;
    divisor += 2n;
  }

  return sum << 1n;
}
