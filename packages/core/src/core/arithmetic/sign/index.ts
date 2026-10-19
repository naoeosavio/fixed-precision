export function sign_value(value: bigint): -1n | 0n | 1n {
  return value < 0n ? -1n : value > 0n ? 1n : 0n;
}
