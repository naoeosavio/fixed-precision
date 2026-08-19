import {
  fromRawWithContext,
  registerFunction,
  resolveContext,
  toScaled,
} from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function idiv(
  value: FixedPrecisionValue,
  other: FixedPrecisionValue,
): FixedPrecisionLike {
  const ctx = resolveContext([value, other]);
  return fromRawWithContext(
    (toScaled(value, ctx) / toScaled(other, ctx)) * ctx.SCALE,
    ctx,
  );
}

registerFunction("idiv", idiv);
