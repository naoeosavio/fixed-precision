import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import {
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../../core/construction/value";

export function clamp(
  value: FixedPrecisionOperand,
  min: FixedPrecisionOperand,
  max: FixedPrecisionOperand,
): FixedPrecisionData {
  const ctx = resolveContext([value, min, max]);
  const raw = toScaled(value, ctx);
  const minRaw = toScaled(min, ctx);
  const maxRaw = toScaled(max, ctx);
  if (minRaw > maxRaw) {
    throw new Error("min must be less than or equal to max");
  }
  return fromRawWithContext(
    raw < minRaw ? minRaw : raw > maxRaw ? maxRaw : raw,
    ctx,
  );
}
