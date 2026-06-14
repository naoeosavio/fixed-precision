export function abs_value(value: bigint): bigint {
  return value < 0n ? -value : value;
}
