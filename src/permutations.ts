import { permutations_value } from "./combinatorics/permutations";
import {
  fromRawWithContext,
  isFixedPrecisionLike,
  registerFunction,
  resolveContext,
} from "./core/value";
import type { FixedPrecisionLike } from "./types";

export function permutations(
  n: number | FixedPrecisionLike,
  k: number | FixedPrecisionLike,
): FixedPrecisionLike {
  const ctx = resolveContext(isFixedPrecisionLike(n) ? [n] : []);
  const valN = isFixedPrecisionLike(n) ? n.trunc().toNumber() : Math.trunc(n);
  const valK = isFixedPrecisionLike(k) ? k.trunc().toNumber() : Math.trunc(k);
  return fromRawWithContext(permutations_value(valN, valK) * ctx.SCALE, ctx);
}

registerFunction("permutations", permutations);
