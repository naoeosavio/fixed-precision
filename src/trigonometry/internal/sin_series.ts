import { MAX_SERIES_ITERATIONS } from "./constants";

export function sin_work(value: bigint, scale: bigint): bigint {
  if (value === 0n) {
    return 0n;
  }

  const value_squared = (value * value) / scale;
  let term = value;
  let sum = value;

  for (let index = 1; index <= MAX_SERIES_ITERATIONS; index += 1) {
    const divisor = BigInt(2 * index * (2 * index + 1));
    term = -(term * value_squared) / (scale * divisor);

    if (term === 0n) {
      break;
    }

    sum += term;
  }

  return sum;
}
