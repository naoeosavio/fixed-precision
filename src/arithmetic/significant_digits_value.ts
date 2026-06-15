import type { FPContext } from "../FixedPrecision";
import { cleanTrailingZeros, count_digits } from "../utils";

export function significant_digits_value(
  value: bigint,
  ctx: FPContext,
  include_zeros = false,
): number {
  const abs_value = value < 0n ? -value : value;
  if (abs_value === 0n) {
    return 1;
  }

  const integer_part = abs_value / ctx.SCALE;
  const fractional_part = abs_value - integer_part * ctx.SCALE;

  if (fractional_part === 0n) {
    const { n: stripped, c: trimmed } = cleanTrailingZeros(integer_part);
    const digits = count_digits(stripped);
    return include_zeros ? digits + trimmed : digits || 1;
  }

  const { n: stripped_frac, c: trimmed_frac } =
    cleanTrailingZeros(fractional_part);

  if (integer_part === 0n) {
    return count_digits(stripped_frac) || 1;
  }

  return count_digits(integer_part) + (ctx.places - trimmed_frac);
}
