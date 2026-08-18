import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { atan2_value } from "./trigonometry/atan2";

export function atan2(
  y: FixedPrecisionValue,
  x: FixedPrecisionValue,
): FixedPrecision {
  const ctx = FixedPrecision.resolveContext([y, x]);
  return FixedPrecision.fromRawWithContext(
    atan2_value(
      FixedPrecision.toScaled(y, ctx),
      FixedPrecision.toScaled(x, ctx),
      ctx,
    ),
    ctx,
  );
}
