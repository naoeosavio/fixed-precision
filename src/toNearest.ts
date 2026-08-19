import { round_to_scale_value } from "./arithmetic/roundToScale";
import {
  fromRawWithContext,
  registerFunction,
  resolveContext,
  toScaled,
} from "./core/value";
import type {
  FixedPrecisionLike,
  FixedPrecisionValue,
  RoundingMode,
} from "./types";

export function toNearest(
  value: FixedPrecisionValue,
  increment: FixedPrecisionValue,
  rm?: RoundingMode,
): FixedPrecisionLike {
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

registerFunction("toNearest", toNearest);
