import { MAX_SERIES_ITERATIONS } from "./ln_constants";

export function exp_reduced_work(value: bigint, scale: bigint): bigint {
  let sum = scale;
  let term = scale;

  for (let divisor = 1n; divisor <= MAX_SERIES_ITERATIONS; divisor += 1n) {
    term = (term * value) / (scale * divisor);
    if (term === 0n) {
      break;
    }
    sum += term;
  }

  return sum;
}
