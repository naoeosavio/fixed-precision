import type { RoundingMode } from "../FixedPrecision";
import { round_half } from "./internal/round_half";
import { round_half_even } from "./internal/round_half_even";
import { round_half_floor } from "./internal/round_half_floor";

export function round_to_scale_value(
  value: bigint,
  rounding_factor: bigint,
  rm: RoundingMode,
): bigint {
  const q = value / rounding_factor;
  if (rm === 1) {
    return q;
  }

  const rem = value - q * rounding_factor;
  if (rem === 0n) {
    return q;
  }

  const is_positive = value > 0n;

  switch (rm) {
    case 0:
      return is_positive ? q + 1n : q - 1n;
    case 2:
      return is_positive ? q + 1n : q;
    case 3:
      return !is_positive ? q - 1n : q;
    case 4:
    case 5:
    case 7:
      return round_half(q, rem, rounding_factor, is_positive, rm);
    case 6:
      return round_half_even(q, rem, rounding_factor, is_positive);
    case 8:
      return round_half_floor(q, rem, rounding_factor, is_positive);
    default:
      throw new Error(`Rounding mode ${rm} is not supported.`);
  }
}
