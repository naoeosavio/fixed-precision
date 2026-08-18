import { cbrt_value } from "./arithmetic/cbrt";
import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function cbrt(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, (raw, ctx) =>
    cbrt_value(raw, ctx.SCALE),
  );
}
