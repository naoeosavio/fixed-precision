import { combinations_value } from "../../core/combinatorics/combinations";
import {
  type FixedPrecisionData,
  fromRawWithContext,
  isFixedPrecisionData,
  resolveContext,
  toScaled,
} from "../construction";

export function combinations(
  n: number | FixedPrecisionData,
  k: number | FixedPrecisionData,
): FixedPrecisionData {
  const ctx = resolveContext(isFixedPrecisionData(n) ? [n] : []);
  const valN = isFixedPrecisionData(n)
    ? Number(toScaled(n, ctx) / ctx.SCALE)
    : Math.trunc(n);
  const valK = isFixedPrecisionData(k)
    ? Number(toScaled(k, ctx) / ctx.SCALE)
    : Math.trunc(k);
  return fromRawWithContext(combinations_value(valN, valK) * ctx.SCALE, ctx);
}
