import {
  fromRawWithContext,
  registerFunction,
  resolveContext,
  toScaled,
} from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function clamp(
  value: FixedPrecisionValue,
  min: FixedPrecisionValue,
  max: FixedPrecisionValue,
): FixedPrecisionLike {
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

registerFunction("clamp", clamp);
