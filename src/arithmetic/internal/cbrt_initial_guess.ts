export function cbrt_initial_guess(value: bigint): bigint {
  const as_number = Number(value);
  if (Number.isFinite(as_number)) {
    const approx = Math.trunc(Math.cbrt(as_number));
    if (approx > 0) {
      const guess = BigInt(approx) + 1n;
      if (guess * guess * guess >= value) {
        return guess;
      }
    }
  }

  const bit_length = value.toString(2).length;
  return 1n << BigInt(Math.ceil(bit_length / 3));
}
