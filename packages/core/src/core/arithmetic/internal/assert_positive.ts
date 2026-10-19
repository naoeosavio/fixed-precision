export function assert_positive(value: bigint): void {
  if (value <= 0n) {
    throw new Error("Logarithm is undefined for non-positive values");
  }
}
