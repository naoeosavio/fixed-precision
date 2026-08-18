import type { FixedPrecisionValue, RoundingMode } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { to_base_with_ctx } from "./string/toBase";

export function toBase(
  value: FixedPrecisionValue,
  base: 2 | 8 | 16,
  sd?: number,
  rm?: RoundingMode,
): string {
  const ctx = FixedPrecision.resolveContext([value]);
  return to_base_with_ctx(
    FixedPrecision.toScaled(value, ctx),
    ctx,
    base,
    sd,
    rm,
  );
}
