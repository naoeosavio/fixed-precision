import { MAX_SERIES_ITERATIONS } from "./constants";

export function cos_work(value: bigint, scale: bigint): bigint {
  if (value === 0n) {
    return scale;
  }

  const value_squared = (value * value) / scale;
  let term = scale;
  let sum = scale;

  for (let index = 1; index <= MAX_SERIES_ITERATIONS; index += 1) {
    const divisor = BigInt((2 * index - 1) * (2 * index));
    term = -(term * value_squared) / (scale * divisor);

    if (term === 0n) {
      break;
    }

    sum += term;
  }

  return sum;
}
