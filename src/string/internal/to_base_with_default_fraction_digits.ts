import type { FPContext } from "../../FixedPrecision";
import { BASE_DIGITS } from "./base_digits";

export function to_base_with_default_fraction_digits(
  value: bigint,
  ctx: FPContext,
  radix: 2 | 8 | 16,
): string {
  if (value === 0n) {
    return "0";
  }

  const sign = value < 0n ? "-" : "";
  const abs_value = value < 0n ? -value : value;
  const integer_part = abs_value / ctx.SCALE;
  let remainder = abs_value - integer_part * ctx.SCALE;
  const fractional_digits: string[] = [];
  const base = BigInt(radix);

  for (let index = 0; index < ctx.places && remainder !== 0n; index += 1) {
    remainder *= base;
    const digit = remainder / ctx.SCALE;
    fractional_digits.push(BASE_DIGITS[Number(digit)] ?? "0");
    remainder -= digit * ctx.SCALE;
  }

  while (fractional_digits[fractional_digits.length - 1] === "0") {
    fractional_digits.pop();
  }

  const integer_string = integer_part.toString(radix);
  return fractional_digits.length === 0
    ? `${sign}${integer_string}`
    : `${sign}${integer_string}.${fractional_digits.join("")}`;
}
