import { to_number_with_ctx } from "../../core/numeric/toNumber";
import { scale } from "../arithmetic/scale";
import {
  type FixedPrecisionOperand,
  resolveContextSingle,
  toScaled,
} from "../construction";

export function toNumber(
  value: FixedPrecisionOperand,
  options?: { places?: number },
): number {
  if (options?.places === undefined) {
    const ctx = resolveContextSingle(value);
    return to_number_with_ctx(toScaled(value, ctx), ctx);
  }

  return toNumber(scale(value, { places: options.places }));
}

export function toNumberBy(options?: { places?: number }) {
  return (value: FixedPrecisionOperand): number => toNumber(value, options);
}
