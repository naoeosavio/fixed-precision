import { scale_value } from "../../core/arithmetic/scale";
import { makeContext } from "../../core/construction/context";
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
