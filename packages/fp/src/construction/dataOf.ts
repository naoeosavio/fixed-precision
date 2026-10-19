import type FixedPrecision from "fixed-precision";
import type { FixedPrecisionData, FixedPrecisionOperand } from "./types";
import { resolveContextSingle, toScaled } from "./value";

export function dataOf(
  value: FixedPrecisionOperand | FixedPrecision,
): FixedPrecisionData {
  if (typeof value === "object" && value !== null && "context" in value) {
    const ctx = value.context();
    return {
      ctx: {
        places: ctx.places,
        roundingMode: ctx.roundingMode,
        SCALE: ctx.SCALE,
        SCALENUMBER: ctx.SCALENUMBER,
      },
      value: value.raw(),
    };
  } else {
    const ctx = resolveContextSingle(value);
    return {
      ctx: {
        places: ctx.places,
        roundingMode: ctx.roundingMode,
        SCALE: ctx.SCALE,
        SCALENUMBER: ctx.SCALENUMBER,
      },
      value: toScaled(value, ctx),
    };
  }
}
