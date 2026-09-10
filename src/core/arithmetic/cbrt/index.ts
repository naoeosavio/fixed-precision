import { cbrt_initial_guess } from "../internal/cbrt_initial_guess";

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

  if (c > target) {
    let steps = 0;
    do {
      current -= 1n;
      c = current * current * current;
      steps++;
    } while (c > target && steps < 8);
    if (c > target) {
      let lo = 0n;
      let hi = current;
      while (hi - lo > 1n) {
        const mid = (lo + hi) >> 1n;
        if (mid * mid * mid > target) {
          hi = mid;
        } else {
          lo = mid;
        }
      }
      current = lo;
    }
  }

  while ((current + 1n) ** 3n <= target) {
    current += 1n;
  }
  return current;
}
