import { round_to_scale_value } from "./arithmetic/roundToScale";
import type { FixedPrecisionValue, RoundingMode } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function toNearest(
  value: FixedPrecisionValue,
  increment: FixedPrecisionValue,
  rm?: RoundingMode,
): FixedPrecision {
  const ctx = FixedPrecision.resolveContext([value, increment]);
  const stepRaw = FixedPrecision.toScaled(increment, ctx);
  const step = stepRaw < 0n ? -stepRaw : stepRaw;
  if (step === 0n) {
    throw new Error("Increment must be non-zero");
  }

  return FixedPrecision.fromRawWithContext(
    round_to_scale_value(
      FixedPrecision.toScaled(value, ctx),
      step,
      rm ?? ctx.roundingMode,
    ) * step,
    ctx,
  );
}
