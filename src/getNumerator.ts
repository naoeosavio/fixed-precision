import {
  fromRawWithContext,
  registerFunction,
  resolveContext,
  toScaled,
} from "./core/value";
import { get_numerator } from "./fractions/getNumerator";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function getNumerator(value: FixedPrecisionValue): FixedPrecisionLike {
  const ctx = resolveContext([value]);
  const numerator = get_numerator(toScaled(value, ctx), ctx.SCALE);
  return fromRawWithContext(numerator * ctx.SCALE, ctx);
}

registerFunction("getNumerator", getNumerator);
