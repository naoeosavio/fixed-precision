import { combinations_value } from "../../../core/src/core/combinatorics/combinations";
import {
  type FixedPrecisionData,
  fromRawWithContext,
  resolveContextSingle,
} from "../construction";
import { asSafeIndex } from "./safeIndex";

export function combinations(
  n: number | FixedPrecisionData,
  k: number | FixedPrecisionData,
): FixedPrecisionData {
  const ctx = resolveContextSingle(n);
  const valN = asSafeIndex(n, "combinations");
  const valK = asSafeIndex(k, "combinations");
  return fromRawWithContext(combinations_value(valN, valK) * ctx.SCALE, ctx);
}

export function combinationsBy(k: number | FixedPrecisionData) {
  return (n: number | FixedPrecisionData): FixedPrecisionData =>
    combinations(n, k);
}
