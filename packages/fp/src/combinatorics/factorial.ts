import { factorial_value } from "../../../core/src/core/combinatorics/factorial";
import {
  type FixedPrecisionData,
  fromRawWithContext,
  resolveContextSingle,
} from "../construction";
import { asSafeIndex } from "./safeIndex";

export function factorial(n: number | FixedPrecisionData): FixedPrecisionData {
  const ctx = resolveContextSingle(n);
  const val = asSafeIndex(n, "factorial");
  return fromRawWithContext(factorial_value(val) * ctx.SCALE, ctx);
}
