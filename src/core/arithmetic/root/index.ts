import { cbrt_value } from "../cbrt";
import { root_initial_guess } from "../internal/root_initial_guess";

function ipow(base: bigint, exp: number): bigint {
  let result = base;
  for (let i = 1; i < exp; i++) {
    result *= base;
  }
  return result;
}

export function root_value(value: bigint, n: number, scale: bigint): bigint {
  if (!Number.isInteger(n)) throw new Error("Root index must be an integer");
  if (n < 1) throw new Error("Root index must be greater than 0");

  if (n === 1) return value;
  if (n === 3) return cbrt_value(value, scale);

  if (value === 0n) return 0n;

  if (value < 0n) {
    if (n % 2 === 0) throw new Error(`Even root of negative number`);
    return -root_value(-value, n, scale);
  }

  const index = BigInt(n);
  const target = value * ipow(scale, n - 1);

  let current = root_initial_guess(target, n);
  let next = (current * (index - 1n) + target / ipow(current, n - 1)) / index;

  while (next < current) {
    current = next;
    next = (current * (index - 1n) + target / ipow(current, n - 1)) / index;
  }

  while (ipow(current, n) > target) {
    current -= 1n;
  }

  while (true) {
    const candidate = current + 1n;
    if (ipow(candidate, n) > target) {
      return current;
    }
    current = candidate;
  }
}
