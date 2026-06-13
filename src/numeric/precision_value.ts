import type { FPContext, RoundingMode } from "../FixedPrecision";
import { precisionPowerOfTen } from "../utils";
import { assert_significant_digits } from "./internal/assert_significant_digits";
import { round_to_scale_value } from "./round_to_scale_value";

export function precision_value(
  value: bigint,
  sd: number,
  rm: RoundingMode,
  ctx: FPContext,
): bigint {
  assert_significant_digits(sd);

  if (value === 0n) {
    return 0n;
  }

  const abs_value = value < 0n ? -value : value;
  const decimal_exponent = abs_value.toString().length - ctx.places - 1;
  const rounding_exponent = ctx.places + decimal_exponent - sd + 1;
  if (rounding_exponent <= 0) {
    return value;
  }

  const factor = precisionPowerOfTen(rounding_exponent);
  return round_to_scale_value(value, factor, rm) * factor;
}
