import { cbrt_value } from "../cbrt";
import { correct_root } from "../internal/correct_root";
import { root_initial_guess } from "../internal/root_initial_guess";

function ipow(base: bigint, exp: number): bigint {
  let result = base;
  for (let i = 1; i < exp; i++) {
    result *= base;
  }
  return result;
}

function assert_valid_index(n: number): void {
  if (!Number.isInteger(n)) throw new Error("Root index must be an integer");
  if (n < 1) throw new Error("Root index must be greater than 0");
}

function newton_root(target: bigint, n: number): bigint {
  const index = BigInt(n);
  let current = root_initial_guess(target, n);
  let p = ipow(current, n - 1);
  let c = p * current;
  let next = (current * (index - 1n) + target / p) / index;

  while (next < current) {
    current = next;
    p = ipow(current, n - 1);
    c = p * current;
    next = (current * (index - 1n) + target / p) / index;
  }

  return correct_root(current, c, target, n);
}

export function root_value(value: bigint, n: number, scale: bigint): bigint {
  assert_valid_index(n);

  if (n === 1) return value;
  if (n === 3) return cbrt_value(value, scale);

  if (value === 0n) return 0n;

  if (value < 0n) {
    if (n % 2 === 0) throw new Error(`Even root of negative number`);
    return -root_value(-value, n, scale);
  }

  return newton_root(value * ipow(scale, n - 1), n);
}
