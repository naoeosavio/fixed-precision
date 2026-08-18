import { shifted_by_value } from "./arithmetic/shiftedBy";
import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function shiftedBy(
  value: FixedPrecisionValue,
  n: number,
): FixedPrecision {
  const ctx = FixedPrecision.resolveContext([value]);
  return FixedPrecision.fromRawWithContext(
    shifted_by_value(FixedPrecision.toScaled(value, ctx), n),
    ctx,
  );
}
