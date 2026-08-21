import { resolveContext, toScaled } from "./core/value";
import type { FixedPrecisionValue } from "./types";
import type { FixedPrecisionData } from "./types/core";

export function dataOf(value: FixedPrecisionValue): FixedPrecisionData {
  const ctx = resolveContext([value]);
  return {
    places: ctx.places,
    roundingMode: ctx.roundingMode,
    SCALE: ctx.SCALE,
    SCALENUMBER: ctx.SCALENUMBER,
    value: toScaled(value, ctx),
  };
}
