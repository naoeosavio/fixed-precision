export function assert_non_zero(value: bigint, message: string): void {
  if (value === 0n) {
    throw new Error(message);
  }
}
