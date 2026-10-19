import type { RoundingMode } from "../../construction/types";

/**
 * Divides a scaled value by a rounding factor with the rounding mode.
 *
 * @param value - Raw scaled value to divide.
 * @param rounding_factor - Positive divisor to remove.
 * @param rm - Rounding mode to apply to the remainder.
 * @returns Rounded quotient.
 */
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
      return is_positive ? q : q - 1n;
  }

  const twice_abs_rem = (rem < 0n ? -rem : rem) << 1n;

  switch (rm) {
    case 4:
      return twice_abs_rem >= rounding_factor
        ? is_positive
          ? q + 1n
          : q - 1n
        : q;
    case 5:
      return twice_abs_rem > rounding_factor
        ? is_positive
          ? q + 1n
          : q - 1n
        : q;
    case 6:
      if (twice_abs_rem === rounding_factor) {
        return q % 2n === 0n ? q : is_positive ? q + 1n : q - 1n;
      }
      return twice_abs_rem > rounding_factor
        ? is_positive
          ? q + 1n
          : q - 1n
        : q;
    case 7:
      if (is_positive) {
        return twice_abs_rem >= rounding_factor ? q + 1n : q;
      }
      return twice_abs_rem > rounding_factor ? q - 1n : q;
    case 8:
      if (is_positive) {
        return twice_abs_rem > rounding_factor ? q + 1n : q;
      }
      return twice_abs_rem >= rounding_factor ? q - 1n : q;
    default:
      throw new Error(`Rounding mode ${rm} is not supported.`);
  }
}
