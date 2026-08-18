import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function multiply(
  value: FixedPrecisionValue,
  amount: FixedPrecisionValue,
): FixedPrecision {
  const ctx = FixedPrecision.resolveContext([value, amount]);
  return FixedPrecision.fromRawWithContext(
    (FixedPrecision.toScaled(value, ctx) *
      FixedPrecision.toScaled(amount, ctx)) /
      ctx.SCALE,
    ctx,
  );
}
