import { round_to_scale_value } from "../../core/arithmetic/roundToScale";
import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
  RoundingMode,
} from "../../core/construction/types";
import {
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../../core/construction/value";

export function toNearest(
  value: FixedPrecisionOperand,
  increment: FixedPrecisionOperand,
  rm?: RoundingMode,
): FixedPrecisionData {
  const ctx = resolveContext([value, increment]);
  const stepRaw = toScaled(increment, ctx);
  const step = stepRaw < 0n ? -stepRaw : stepRaw;
  if (step === 0n) {
    throw new Error("Increment must be non-zero");
  }

  return fromRawWithContext(
    round_to_scale_value(toScaled(value, ctx), step, rm ?? ctx.roundingMode) *
      step,
    ctx,
  );
}
