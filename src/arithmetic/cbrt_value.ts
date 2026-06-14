import { cbrt_initial_guess } from "./internal/cbrt_initial_guess";

export function cbrt_value(value: bigint, scale: bigint): bigint {
  if (value < 0n) {
    return -cbrt_value(-value, scale);
  }

  if (value === 0n) {
    return 0n;
  }

  const target = value * scale * scale;
  let current = cbrt_initial_guess(target);
  let next = ((current << 1n) + target / (current * current)) / 3n;

  while (next < current) {
    current = next;
    next = ((current << 1n) + target / (current * current)) / 3n;
  }

  while (current * current * current > target) {
    current -= 1n;
  }

  while (true) {
    const candidate = current + 1n;
    if (candidate * candidate * candidate > target) {
      return current;
    }
    current = candidate;
  }
}
