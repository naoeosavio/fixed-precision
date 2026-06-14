import type { FPContext, RoundingMode } from "../../FixedPrecision";
import { round_to_scale_value } from "../../numeric/index";
import { assert_significant_digits } from "./assert_significant_digits";
import { base_exponent } from "./base_exponent";
import { base_power } from "./base_power";
import { format_base_quotient } from "./format_base_quotient";

export function to_base_with_significant_digits(
  value: bigint,
  ctx: FPContext,
  radix: 2 | 8 | 16,
  sd: number,
  rm?: RoundingMode,
): string {
  assert_significant_digits(sd);

  if (value === 0n) {
    return "0";
  }

  const exponent = base_exponent(value, ctx.SCALE, radix);
  const unit_exponent = exponent - sd + 1;
  const rounding_mode = rm ?? ctx.roundingMode;

  if (unit_exponent >= 0) {
    const unit = ctx.SCALE * base_power(radix, unit_exponent);
    const quotient = round_to_scale_value(value, unit, rounding_mode);
    return ((quotient * unit) / ctx.SCALE).toString(radix);
  }

  const fractional_places = -unit_exponent;
  const base_scale = base_power(radix, fractional_places);
  const quotient = round_to_scale_value(
    value * base_scale,
    ctx.SCALE,
    rounding_mode,
  );
  return format_base_quotient(quotient, radix, fractional_places);
}
