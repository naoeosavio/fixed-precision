export function to_work_scale(value: bigint, guard_scale: bigint): bigint {
  return value * guard_scale;
}

export function from_work_scale(value: bigint, guard_scale: bigint): bigint {
  return value / guard_scale;
}
