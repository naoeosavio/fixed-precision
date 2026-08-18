import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function clamp(
  value: FixedPrecisionValue,
  min: FixedPrecisionValue,
  max: FixedPrecisionValue,
): FixedPrecision {
  const ctx = FixedPrecision.resolveContext([value, min, max]);
  const raw = FixedPrecision.toScaled(value, ctx);
  const minRaw = FixedPrecision.toScaled(min, ctx);
  const maxRaw = FixedPrecision.toScaled(max, ctx);
  if (minRaw > maxRaw) {
    throw new Error("min must be less than or equal to max");
  }
  return FixedPrecision.fromRawWithContext(
    raw < minRaw ? minRaw : raw > maxRaw ? maxRaw : raw,
    ctx,
  );
}
