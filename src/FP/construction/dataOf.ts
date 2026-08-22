import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { resolveContext, toScaled } from "../../core/construction/value";
import type FixedPrecision from "../../FixedPrecision";

export function dataOf(
  value: FixedPrecisionOperand | FixedPrecision,
): FixedPrecisionData {
  if (typeof value === "object" && value !== null && "context" in value) {
    const ctx = value.context();
    return {
      places: ctx.places,
      roundingMode: ctx.roundingMode,
      SCALE: ctx.SCALE,
      SCALENUMBER: ctx.SCALENUMBER,
      value: value.raw(),
    };
  }
  const ctx = resolveContext([value]);
  return {
    places: ctx.places,
    roundingMode: ctx.roundingMode,
    SCALE: ctx.SCALE,
    SCALENUMBER: ctx.SCALENUMBER,
    value: toScaled(value, ctx),
  };
}
