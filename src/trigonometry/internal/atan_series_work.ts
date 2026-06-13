import { MAX_SERIES_ITERATIONS } from "./constants";

export function atan_series_work(value: bigint, scale: bigint): bigint {
  const value_squared = (value * value) / scale;
  let term = value;
  let sum = value;

  for (let index = 1; index <= MAX_SERIES_ITERATIONS; index += 1) {
    term = -(term * value_squared) / scale;

    if (term === 0n) {
      break;
    }

    sum += term / BigInt(2 * index + 1);
  }

  return sum;
}
