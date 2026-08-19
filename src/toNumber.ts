import { registerFunction, resolveContext, toScaled } from "./core/value";
import { to_number_with_ctx } from "./numeric/toNumber";
import { scale } from "./scale";
import type { FixedPrecisionValue } from "./types";

export function toNumber(value: FixedPrecisionValue, places?: number): number {
  if (places === undefined) {
    const ctx = resolveContext([value]);
    return to_number_with_ctx(toScaled(value, ctx), ctx);
  }

  return toNumber(scale(value, places));
}

registerFunction("toNumber", toNumber);
