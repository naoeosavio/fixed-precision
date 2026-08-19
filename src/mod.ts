import {
  fromRawWithContext,
  registerFunction,
  resolveContext,
  toScaled,
} from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function mod(
  value: FixedPrecisionValue,
  amount: FixedPrecisionValue,
): FixedPrecisionLike {
  const ctx = resolveContext([value, amount]);
  return fromRawWithContext(
    (toScaled(value, ctx) * ctx.SCALE) % toScaled(amount, ctx),
    ctx,
  );
}

registerFunction("mod", mod);
