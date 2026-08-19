import {
  fromRawWithContext,
  registerFunction,
  resolveContext,
  toScaled,
} from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function divmod(
  value: FixedPrecisionValue,
  other: FixedPrecisionValue,
): { quotient: FixedPrecisionLike; remainder: FixedPrecisionLike } {
  const ctx = resolveContext([value, other]);
  const raw = toScaled(value, ctx);
  const otherRaw = toScaled(other, ctx);
  const quotient = fromRawWithContext((raw * ctx.SCALE) / otherRaw, ctx);

  return {
    quotient,
    remainder: fromRawWithContext(
      raw - (quotient.raw() * otherRaw) / ctx.SCALE,
      ctx,
    ),
  };
}

registerFunction("divmod", divmod);
