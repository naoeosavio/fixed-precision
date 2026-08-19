import {
  fromRawWithContext,
  registerFunction,
  resolveContext,
  toScaled,
} from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function multiply(
  value: FixedPrecisionValue,
  amount: FixedPrecisionValue,
): FixedPrecisionLike {
  const ctx = resolveContext([value, amount]);
  return fromRawWithContext(
    (toScaled(value, ctx) * toScaled(amount, ctx)) / ctx.SCALE,
    ctx,
  );
}

registerFunction("multiply", multiply);
