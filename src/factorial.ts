import { factorial_value } from "./combinatorics/factorial";
import {
  fromRawWithContext,
  isFixedPrecisionLike,
  registerFunction,
  resolveContext,
} from "./core/value";
import type { FixedPrecisionLike } from "./types";

export function factorial(n: number | FixedPrecisionLike): FixedPrecisionLike {
  const ctx = resolveContext(isFixedPrecisionLike(n) ? [n] : []);
  const val = isFixedPrecisionLike(n) ? n.trunc().toNumber() : Math.trunc(n);
  return fromRawWithContext(factorial_value(val) * ctx.SCALE, ctx);
}

registerFunction("factorial", factorial);
