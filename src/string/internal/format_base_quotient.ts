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

  const fractional_digits = fractional_part
    .toString(radix)
    .padStart(fractional_places, "0")
    .replace(/0+$/, "");

  return `${sign}${integer_part.toString(radix)}.${fractional_digits}`;
}
