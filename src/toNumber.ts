import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { to_number_with_ctx } from "./numeric/toNumber";
import { scale } from "./scale";

export function toNumber(value: FixedPrecisionValue, places?: number): number {
  if (places === undefined) {
    const ctx = FixedPrecision.resolveContext([value]);
    return to_number_with_ctx(FixedPrecision.toScaled(value, ctx), ctx);
  }

  return toNumber(scale(value, places));
}
