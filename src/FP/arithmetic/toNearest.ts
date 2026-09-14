import { round_to_scale_value } from "../../core/arithmetic/roundToScale";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  type RoundingMode,
  toScaledPair,
} from "../construction";

export function toNearest(
  value: FixedPrecisionOperand,
  increment: FixedPrecisionOperand,
  options?: { roundingMode?: RoundingMode },
): FixedPrecisionData {
  const scaled = toScaledPair(value, increment);
  const step = scaled.right < 0n ? -scaled.right : scaled.right;
  if (step === 0n) {
    throw new Error("Increment must be non-zero");
  }

  return fromRawWithContext(
    round_to_scale_value(
      scaled.left,
      step,
      options?.roundingMode ?? scaled.ctx.roundingMode,
    ) * step,
    scaled.ctx,
  );
}
