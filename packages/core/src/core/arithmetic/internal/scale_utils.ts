import { GUARD_SCALE } from "./ln_constants";

export function to_work_scale(
  value: bigint,
  guard: bigint = GUARD_SCALE,
): bigint {
  return value * guard;
}

export function from_work_scale(
  value: bigint,
  guard: bigint = GUARD_SCALE,
): bigint {
  return value / guard;
}
