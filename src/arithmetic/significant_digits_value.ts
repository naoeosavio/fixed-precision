import type { FPContext } from "../FixedPrecision";

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
    const integer_digits = integer_part.toString();
    return include_zeros
      ? integer_digits.length
      : integer_digits.replace(/0+$/, "").length;
  }

  const fractional_digits = fractional_part
    .toString()
    .padStart(ctx.places, "0")
    .replace(/0+$/, "");

  if (integer_part === 0n) {
    return fractional_digits.replace(/^0+/, "").length;
  }

  return integer_part.toString().length + fractional_digits.length;
}
