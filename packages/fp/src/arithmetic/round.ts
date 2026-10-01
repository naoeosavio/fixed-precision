import { round_value } from "../../../core/src/core/arithmetic/round";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
  type PlacesOptions,
} from "../construction";

export function round(
  value: FixedPrecisionOperand,
  options?: PlacesOptions,
): FixedPrecisionData {
  return fromContextValue(value, (raw, ctx) =>
    round_value(
      raw,
      options?.places ?? ctx.places,
      options?.roundingMode ?? ctx.roundingMode,
      ctx,
    ),
  );
}

export function roundBy(options?: PlacesOptions) {
  return (value: FixedPrecisionOperand): FixedPrecisionData =>
    round(value, options);
}
