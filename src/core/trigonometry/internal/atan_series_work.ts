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
  let odd = 1n;
  let denominator = scale * 3n;
  const denominator_step = scale << 1n;

  for (let index = 1; index <= max_iterations; index += 1) {
    term = -((term * value_squared * odd) / denominator);

    if (term === 0n) {
      break;
    }

    sum += term;
    odd += 2n;
    denominator += denominator_step;
  }

  return sum;
}
