import { scale_value } from "../../core/arithmetic/scale";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  makeContext,
  resolveContext,
  type ScaleOptions,
  toScaled,
} from "../construction";

export function scale(
  value: FixedPrecisionOperand,
  options: ScaleOptions,
): FixedPrecisionData {
  const ctx = resolveContext([value]);
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
