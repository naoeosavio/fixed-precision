import { permutations_value } from "../../core/combinatorics/permutations";
import type { FixedPrecisionData } from "../../core/construction/types";
import {
  fromRawWithContext,
  isFixedPrecisionData,
  resolveContext,
  toScaled,
} from "../../core/construction/value";

export function permutations(
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
  return fromRawWithContext(permutations_value(valN, valK) * ctx.SCALE, ctx);
}
