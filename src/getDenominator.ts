import {
  fromRawWithContext,
  registerFunction,
  resolveContext,
  toScaled,
} from "./core/value";
import { get_denominator } from "./fractions/getDenominator";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function getDenominator(value: FixedPrecisionValue): FixedPrecisionLike {
  const ctx = resolveContext([value]);
  const denominator = get_denominator(toScaled(value, ctx), ctx.SCALE);
  return fromRawWithContext(denominator * ctx.SCALE, ctx);
}

registerFunction("getDenominator", getDenominator);
