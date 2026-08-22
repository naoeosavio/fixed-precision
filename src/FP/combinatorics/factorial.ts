import { factorial_value } from "../../core/combinatorics/factorial";
import type { FixedPrecisionData } from "../../core/construction/types";
import {
  fromRawWithContext,
  isFixedPrecisionData,
  resolveContext,
  toScaled,
} from "../../core/construction/value";

export function factorial(n: number | FixedPrecisionData): FixedPrecisionData {
  const ctx = resolveContext(isFixedPrecisionData(n) ? [n] : []);
  const val = isFixedPrecisionData(n)
    ? Number(toScaled(n, ctx) / ctx.SCALE)
    : Math.trunc(n);
  return fromRawWithContext(factorial_value(val) * ctx.SCALE, ctx);
}
