import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function bitOr(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): FixedPrecision {
  const ctx = FixedPrecision.resolveContext([left, right]);
  return FixedPrecision.fromRawWithContext(
    // biome-ignore lint/suspicious/noBitwiseOperators: operação bitwise intencional
    FixedPrecision.toScaled(left, ctx) | FixedPrecision.toScaled(right, ctx),
    ctx,
  );
}
