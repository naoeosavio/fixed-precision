import type { FPContext, RoundingMode } from "../FixedPrecision";
import { powerOfTen } from "../utils";
import { round_to_scale_value } from "./round_to_scale_value";

export function scale_value(
  value: bigint,
  new_places: number,
  rm: RoundingMode,
  ctx: FPContext,
): bigint {
  if (!Number.isInteger(new_places) || new_places < 0 || new_places > 20) {
    throw new Error("newScale must be an integer between 0 and 20");
  }

  if (new_places === ctx.places) {
    return value;
  }

  if (new_places > ctx.places) {
    return value * powerOfTen(new_places - ctx.places);
  }

  const factor = powerOfTen(ctx.places - new_places);
  return round_to_scale_value(value, factor, rm);
}
