import { scale_value } from "./arithmetic/scale";
import { makeContext } from "./core/context";
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

export function scale(
  value: FixedPrecisionValue,
  places: number,
  rm?: RoundingMode,
): FixedPrecisionLike {
  const ctx = resolveContext([value]);
  const effectiveRm = rm ?? ctx.roundingMode;
  const nextValue = scale_value(toScaled(value, ctx), places, effectiveRm, ctx);
  return fromRawWithContext(nextValue, makeContext(places, effectiveRm));
}

registerFunction("scale", scale);
