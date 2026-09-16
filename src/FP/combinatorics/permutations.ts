import { permutations_value } from "../../core/combinatorics/permutations";
import {
  type FixedPrecisionData,
  fromRawWithContext,
  resolveContextSingle,
} from "../construction";
import { asSafeIndex } from "./safeIndex";

export function permutations(
  n: number | FixedPrecisionData,
  k: number | FixedPrecisionData,
): FixedPrecisionData {
  const ctx = resolveContextSingle(n);
  const valN = asSafeIndex(n, "permutations");
  const valK = asSafeIndex(k, "permutations");
  return fromRawWithContext(permutations_value(valN, valK) * ctx.SCALE, ctx);
}

export function permutationsBy(k: number | FixedPrecisionData) {
  return (n: number | FixedPrecisionData): FixedPrecisionData =>
    permutations(n, k);
}
