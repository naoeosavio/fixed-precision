import type { FPContext, RoundingMode } from "../FixedPrecision";
import { powerOfTen } from "../utils";
import { round_half_up_scaled_value } from "./internal/round_half_up_scaled_value";
import { round_to_scale_value } from "./round_to_scale_value";

export function round_value(
  value: bigint,
  dp: number,
  rm: RoundingMode,
  ctx: FPContext,
): bigint {
  if (dp < 0 || dp > ctx.places) {
    throw new Error(`Decimal places (dp) must be between 0 and ${ctx.places}`);
  }
  const diff = ctx.places - dp;
  const factor = powerOfTen(diff);
  if (rm === 4) {
    return round_half_up_scaled_value(value, factor);
  }
  return round_to_scale_value(value, factor, rm) * factor;
}
