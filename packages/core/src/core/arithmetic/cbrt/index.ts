import { cbrt_initial_guess } from "../internal/cbrt_initial_guess";
import { correct_root } from "../internal/correct_root";

export function cbrt_value(value: bigint, scale: bigint): bigint {
  if (value < 0n) {
    return -cbrt_value(-value, scale);
  }

  if (value === 0n) {
    return 0n;
  }

  const target = value * scale * scale;
  let current = cbrt_initial_guess(target);
  let q = current * current;
  let c = q * current;
  let next = ((current << 1n) + target / q) / 3n;

  while (next < current) {
    current = next;
    q = current * current;
    c = q * current;
    next = ((current << 1n) + target / q) / 3n;
  }

  return correct_root(current, c, target, 3);
}
