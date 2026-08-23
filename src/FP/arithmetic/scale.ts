import { scale_value } from "../../core/arithmetic/scale";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  makeContext,
  type RoundingMode,
  resolveContext,
  toScaled,
} from "../construction";

export function scale(
  value: FixedPrecisionOperand,
  places: number,
  rm?: RoundingMode,
): FixedPrecisionData {
  const ctx = resolveContext([value]);
  const effectiveRm = rm ?? ctx.roundingMode;
  const nextValue = scale_value(toScaled(value, ctx), places, effectiveRm, ctx);
  return fromRawWithContext(nextValue, makeContext(places, effectiveRm));
}
