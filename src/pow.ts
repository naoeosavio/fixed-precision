import { power } from "./arithmetic/power";
import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function pow(value: FixedPrecisionValue, exp: number): FixedPrecision {
  return FixedPrecision.fromContextValue(value, (raw, ctx) =>
    power(raw, exp, ctx.SCALE),
  );
}
