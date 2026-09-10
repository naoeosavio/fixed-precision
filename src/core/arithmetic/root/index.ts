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
  let p = ipow(current, n - 1);
  let c = p * current;
  let next = (current * (index - 1n) + target / p) / index;

  while (next < current) {
    current = next;
    p = ipow(current, n - 1);
    c = p * current;
    next = (current * (index - 1n) + target / p) / index;
  }

  if (c > target) {
    let steps = 0;
    do {
      current -= 1n;
      c = ipow(current, n);
      steps++;
    } while (c > target && steps < 8);
    if (c > target) {
      let lo = 0n;
      let hi = current;
      while (hi - lo > 1n) {
        const mid = (lo + hi) >> 1n;
        if (ipow(mid, n) > target) {
          hi = mid;
        } else {
          lo = mid;
        }
      }
      current = lo;
    }
  }

  while (ipow(current + 1n, n) <= target) {
    current += 1n;
  }
  return current;
}
