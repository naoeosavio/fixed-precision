import { factorial_value } from "../../core/combinatorics/factorial";
import {
  type FixedPrecisionData,
  fromRawWithContext,
  isFixedPrecisionData,
  resolveContextSingle,
  toScaled,
} from "../construction";

export function factorial(n: number | FixedPrecisionData): FixedPrecisionData {
  const ctx = resolveContextSingle(n);
  const val = isFixedPrecisionData(n)
    ? Number(toScaled(n, ctx) / ctx.SCALE)
    : Math.trunc(n);
  return fromRawWithContext(factorial_value(val) * ctx.SCALE, ctx);
}
