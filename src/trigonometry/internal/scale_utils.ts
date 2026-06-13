import { GUARD_SCALE } from "./constants";

export function to_work_scale(value: bigint): bigint {
  return value * GUARD_SCALE;
}

export function from_work_scale(value: bigint): bigint {
  return value / GUARD_SCALE;
}
