function div_round(a: bigint, b: bigint): bigint {
  const half = b / 2n;
  if (a >= 0n) {
    return (a + half) / b;
  }
  return (a - half) / b;
}

export function sin_work(
  value: bigint,
  scale: bigint,
  max_iterations: number,
): bigint {
  if (value === 0n) {
    return 0n;
  }

  const x2 = div_round(value * value, scale);
  let term = value;
  let sum = value;

  for (let n = 1; n <= max_iterations; n++) {
    const divisor = BigInt(2 * n * (2 * n + 1));
    term = -div_round(div_round(term * x2, scale), divisor);

    if (term === 0n) {
      break;
    }

    sum += term;
  }

  return sum;
}
