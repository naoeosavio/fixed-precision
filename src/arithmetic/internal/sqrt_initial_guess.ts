export function sqrt_initial_guess(value: bigint): bigint {
  const as_number = Number(value);
  if (Number.isFinite(as_number)) {
    const approx = Math.trunc(Math.sqrt(as_number));
    if (approx > 0) {
      const guess = BigInt(approx) + 1n;
      if (guess * guess >= value) {
        return guess;
      }
    }
  }

  const bit_length = value.toString(2).length;
  return 1n << BigInt((bit_length + 1) >> 1);
}
