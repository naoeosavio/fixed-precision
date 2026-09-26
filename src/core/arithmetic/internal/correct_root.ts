const MAX_STEP_DOWN_STEPS = 8;

function ipow(base: bigint, exp: number): bigint {
  let result = base;
  for (let i = 1; i < exp; i++) {
    result *= base;
  }
  return result;
}

function power_of(value: bigint, n: number): bigint {
  if (n === 3) {
    return value * value * value;
  }
  return ipow(value, n);
}

/**
 * Steps an overshooting Newton result down while its power exceeds the target.
 *
 * The overshoot is almost always a single unit, so a bounded number of
 * decrements finishes the job; anything beyond that is left to the caller.
 *
 * @param current - Root candidate that overshoots the target.
 * @param target - Scaled value whose root is being solved.
 * @param n - Root index being solved.
 * @returns The stepped-down candidate, still possibly above the target.
 */
function step_down_to_target(
  current: bigint,
  target: bigint,
  n: number,
): bigint {
  let result = current;
  let steps = 0;
  do {
    result -= 1n;
    steps++;
  } while (power_of(result, n) > target && steps < MAX_STEP_DOWN_STEPS);
  return result;
}

/**
 * Binary searches the largest candidate whose power stays under the target.
 *
 * @param upper - Candidate known to be above the target, as the search ceiling.
 * @param target - Scaled value whose root is being solved.
 * @param n - Root index being solved.
 * @returns The largest candidate whose power does not exceed the target.
 */
function search_below_target(upper: bigint, target: bigint, n: number): bigint {
  let low = 0n;
  let high = upper;
  while (high - low > 1n) {
    const mid = (low + high) >> 1n;
    if (power_of(mid, n) > target) {
      high = mid;
    } else {
      low = mid;
    }
  }
  return low;
}

/**
 * Turns a Newton result into the largest root that does not exceed the target.
 *
 * Shared by the n-th root and the cube root: both run the same Newton
 * iteration, then the same correction — step down, binary search if a single
 * step was not enough, then step up while the next candidate still fits.
 *
 * @param current - Root candidate produced by the Newton iteration.
 * @param current_power - The candidate already raised to `n`, tracked by the
 * Newton iteration so the first check costs no extra multiplications.
 * @param target - Scaled value whose root is being solved.
 * @param n - Root index being solved.
 * @returns The corrected root.
 */
export function correct_root(
  current: bigint,
  current_power: bigint,
  target: bigint,
  n: number,
): bigint {
  let result = current;
  if (current_power > target) {
    result = step_down_to_target(result, target, n);
    if (power_of(result, n) > target) {
      result = search_below_target(result, target, n);
    }
  }
  while (power_of(result + 1n, n) <= target) {
    result += 1n;
  }
  return result;
}
