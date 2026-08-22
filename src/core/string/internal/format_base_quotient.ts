import { cleanTrailingZeros } from "../../utils";
import { base_power } from "./base_power";

export function format_base_quotient(
  quotient: bigint,
  radix: 2 | 8 | 16,
  fractional_places: number,
): string {
  const sign = quotient < 0n ? "-" : "";
  const abs_quotient = quotient < 0n ? -quotient : quotient;
  const base_scale = base_power(radix, fractional_places);
  const integer_part = abs_quotient / base_scale;
  const fractional_part = abs_quotient - integer_part * base_scale;

  if (fractional_part === 0n) {
    return `${sign}${integer_part.toString(radix)}`;
  }

  const { n: stripped_frac, c: trimmed_frac } = cleanTrailingZeros(
    fractional_part,
    radix,
  );
  const fractional_digits = stripped_frac
    .toString(radix)
    .padStart(fractional_places - trimmed_frac, "0");

  return `${sign}${integer_part.toString(radix)}.${fractional_digits}`;
}
