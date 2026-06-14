import { sqrt_initial_guess } from "./internal/sqrt_initial_guess";

export function sqrt_value(value: bigint, scale: bigint): bigint {
  if (value < 0n) {
    throw new Error("Square root of negative number");
  }
  if (value === 0n) {
    return 0n;
  }

  const target = value * scale;
  if (target < 2n) {
    return target;
  }

  let current = sqrt_initial_guess(target);
  let next = (current + target / current) >> 1n;

  while (next < current) {
    current = next;
    next = (current + target / current) >> 1n;
  }

  return current;
}
