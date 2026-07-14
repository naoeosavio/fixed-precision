export function atan_series_work(
  value: bigint,
  scale: bigint,
  max_iterations: number,
): bigint {
  if (value === 0n) {
    return 0n;
  }

  const value_squared = (value * value) / scale;
  let term = value;
  let sum = value;

  for (let index = 1; index <= max_iterations; index += 1) {
    term = -(term * value_squared) / scale;

    if (term === 0n) {
      break;
    }

    sum += term / BigInt(2 * index + 1);
  }

  return sum;
}
