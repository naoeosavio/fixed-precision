export function is_small_x(value: bigint, scale: bigint): boolean {
  const magnitude = value < 0n ? -value : value;
  return magnitude * 1000000n <= scale;
}

export function sinh_series_small(value: bigint, scale: bigint): bigint {
  const value_squared = (value * value) / scale;
  const term = (value * value_squared) / (scale * 6n);
  if (term === 0n) {
    return value;
  }
  let sum = value + term;
  const term5 = (term * value_squared) / (scale * 20n);
  sum += term5;
  if (term5 !== 0n) {
    sum += (term5 * value_squared) / (scale * 42n);
  }
  return sum;
}

export function tanh_series_small(value: bigint, scale: bigint): bigint {
  const value_squared = (value * value) / scale;
  const term3 = (value * value_squared) / (scale * 3n);
  let sum = value - term3;
  if (term3 !== 0n) {
    const term5 = (term3 * value_squared * 2n) / (scale * 5n);
    sum += term5;
    if (term5 !== 0n) {
      sum -= (term5 * value_squared * 17n) / (scale * 42n);
    }
  }
  return sum;
}
