import { power } from "./arithmetic/power";
import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function cube(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, (raw, ctx) =>
    power(raw, 3, ctx.SCALE),
  );
}
