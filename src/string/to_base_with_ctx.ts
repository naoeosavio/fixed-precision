import type { FPContext, RoundingMode } from "../FixedPrecision";
import { to_base_with_default_fraction_digits } from "./internal/to_base_with_default_fraction_digits";
import { to_base_with_significant_digits } from "./internal/to_base_with_significant_digits";

export function to_base_with_ctx(
  value: bigint,
  ctx: FPContext,
  radix: 2 | 8 | 16,
  sd?: number,
  rm?: RoundingMode,
): string {
  if (sd !== undefined) {
    return to_base_with_significant_digits(value, ctx, radix, sd, rm);
  }

  return to_base_with_default_fraction_digits(value, ctx, radix);
}
