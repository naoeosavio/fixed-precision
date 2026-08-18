import { sqrt_value } from "./arithmetic/sqrt";
import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function sqrt(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, (raw, ctx) =>
    sqrt_value(raw, ctx.SCALE),
  );
}
