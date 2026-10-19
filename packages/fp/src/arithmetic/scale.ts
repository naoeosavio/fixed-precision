import { scale_value } from "../../../core/src/core/arithmetic/scale";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  makeContext,
  resolveContextSingle,
  type ScaleOptions,
  toScaled,
} from "../construction";

export function scale(
  value: FixedPrecisionOperand,
  options: ScaleOptions,
): FixedPrecisionData {
  const ctx = resolveContextSingle(value);
  const effectiveRm = options.roundingMode ?? ctx.roundingMode;
  const nextValue = scale_value(
    toScaled(value, ctx),
    options.places,
    effectiveRm,
    ctx,
  );
  return fromRawWithContext(
    nextValue,
    makeContext(options.places, effectiveRm),
  );
}

export function scaleBy(options: ScaleOptions) {
  return (value: FixedPrecisionOperand): FixedPrecisionData =>
    scale(value, options);
}
