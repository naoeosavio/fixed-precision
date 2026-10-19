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
  let denominator = scale * 2n;
  let n = 1;

  while (n < max_iterations) {
    term = -((term * value_squared) / denominator);
    if (term === 0n) {
      break;
    }
    sum += term;
    n++;
    denominator += scale * BigInt(8 * n - 6);
  }

  return sum;
}
