export function cos_series(
  value: bigint,
  scale: bigint,
  max_iterations: number,
) {
  if (value === 0n) {
    return scale;
  }

  const value_squared = (value * value) / scale;
  let term = scale;
  let sum = term;
  let n = 1;

  while (n < max_iterations) {
    term = -((term * value_squared) / (scale * BigInt((2 * n - 1) * (2 * n))));
    if (term === 0n) {
      break;
    }
    sum += term;
    n++;
  }

  return sum;
}
