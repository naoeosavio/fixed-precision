function ipow(base: bigint, exp: number): bigint {
  let result = base;
  for (let i = 1; i < exp; i++) {
    result *= base;
  }
  return result;
}

export function root_initial_guess(value: bigint, n: number): bigint {
  const as_number = Number(value);
  if (Number.isFinite(as_number)) {
    const approx = Math.trunc(as_number ** (1 / n));
    if (approx > 0) {
      const guess = BigInt(approx) + 1n;
      if (ipow(guess, n) >= value) {
        return guess;
      }
    }
  }

  const bit_length = value.toString(2).length;
  return 1n << BigInt(Math.ceil(bit_length / n));
}
