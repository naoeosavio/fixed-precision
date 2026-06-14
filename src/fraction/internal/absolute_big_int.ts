export function absolute_big_int(value: bigint): bigint {
  return value < 0n ? -value : value;
}
