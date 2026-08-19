import { registerFunction, resolveContext, toScaled } from "./core/value";
import { to_base_with_ctx } from "./string/toBase";
import type { FixedPrecisionValue, RoundingMode } from "./types";

export function toBase(
  value: FixedPrecisionValue,
  base: 2 | 8 | 16,
  sd?: number,
  rm?: RoundingMode,
): string {
  const ctx = resolveContext([value]);
  return to_base_with_ctx(toScaled(value, ctx), ctx, base, sd, rm);
}

registerFunction("toBase", toBase);
