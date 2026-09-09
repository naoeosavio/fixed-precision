import { MAX_SERIES_ITERATIONS } from "./ln_constants";

export function exp_reduced_work(
  value: bigint,
  scale: bigint,
  max_iterations: bigint = MAX_SERIES_ITERATIONS,
): bigint {
  let sum = scale;
  let term = scale;

  for (let divisor = 1n; divisor <= max_iterations; divisor += 1n) {
    term = (term * value) / (scale * divisor);
    if (term === 0n) {
      return sum;
    }
    sum += term;
  }

  if (term !== 0n) {
    throw new Error(
      "exp series failed to converge within the maximum number of iterations",
    );
  }
  return sum;
}
