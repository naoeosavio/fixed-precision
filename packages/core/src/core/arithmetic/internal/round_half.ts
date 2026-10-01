import type { RoundingMode } from "../../construction/types";

export function round_half(
  q: bigint,
  rem: bigint,
  factor: bigint,
  is_positive: boolean,
  rm: RoundingMode,
): bigint {
  const twice_abs_rem = (rem < 0n ? -rem : rem) << 1n;

  if (rm === 7) {
    if (is_positive) {
      return twice_abs_rem >= factor ? q + 1n : q;
    }
    return twice_abs_rem > factor ? q - 1n : q;
  }

  const should_round =
    rm === 4 ? twice_abs_rem >= factor : twice_abs_rem > factor;
  return should_round ? (is_positive ? q + 1n : q - 1n) : q;
}
