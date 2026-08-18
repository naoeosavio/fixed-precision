import { scale_value } from "./arithmetic/scale";
import { makeContext } from "./core/context";
import type { FixedPrecisionValue, RoundingMode } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function scale(
  value: FixedPrecisionValue,
  places: number,
  rm?: RoundingMode,
): FixedPrecision {
  const ctx = FixedPrecision.resolveContext([value]);
  const effectiveRm = rm ?? ctx.roundingMode;
  const nextValue = scale_value(
    FixedPrecision.toScaled(value, ctx),
    places,
    effectiveRm,
    ctx,
  );
  return FixedPrecision.fromRawWithContext(
    nextValue,
    makeContext(places, effectiveRm),
  );
}
