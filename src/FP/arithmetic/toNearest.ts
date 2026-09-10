import { round_to_scale_value } from "../../core/arithmetic/roundToScale";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  type RoundingMode,
  resolveContextPair,
  toScaled,
} from "../construction";

export function toNearest(
  value: FixedPrecisionOperand,
  increment: FixedPrecisionOperand,
  options?: { roundingMode?: RoundingMode },
): FixedPrecisionData {
  const ctx = resolveContextPair(value, increment);
  const stepRaw = toScaled(increment, ctx);
  const step = stepRaw < 0n ? -stepRaw : stepRaw;
  if (step === 0n) {
    throw new Error("Increment must be non-zero");
  }

  return fromRawWithContext(
    round_to_scale_value(
      toScaled(value, ctx),
      step,
      options?.roundingMode ?? ctx.roundingMode,
    ) * step,
    ctx,
  );
}
