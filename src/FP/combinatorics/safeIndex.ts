import {
  isFixedPrecisionData,
  resolveContextSingle,
  toScaled,
} from "../construction";
import type { FixedPrecisionData } from "../construction/types";

export function asSafeIndex(
  n: number | FixedPrecisionData,
  operation: string,
): number {
  if (isFixedPrecisionData(n)) {
    const ctx = resolveContextSingle(n);
    const val = Number(toScaled(n, ctx) / ctx.SCALE);
    if (!Number.isSafeInteger(val)) {
      throw new Error(`${operation} argument must be a safe integer`);
    }
    return val;
  }
  const val = Math.trunc(n);
  if (!Number.isSafeInteger(val)) {
    throw new Error(`${operation} argument must be a safe integer`);
  }
  return val;
}
