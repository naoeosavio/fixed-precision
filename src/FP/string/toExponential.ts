import { to_exponential_with_ctx } from "../../core/string/toExponential";
import {
  type FixedPrecisionOperand,
  type PlacesOptions,
  resolveContextSingle,
  toScaled,
} from "../construction";

export function toExponential(
  value: FixedPrecisionOperand,
  options?: PlacesOptions,
): string {
  const ctx = resolveContextSingle(value);
  return to_exponential_with_ctx(
    toScaled(value, ctx),
    ctx,
    options?.places,
    options?.roundingMode,
  );
}

export function toExponentialBy(options?: PlacesOptions) {
  return (value: FixedPrecisionOperand): string =>
    toExponential(value, options);
}
