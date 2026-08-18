import { round_value } from "./arithmetic/round";
import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function floor(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, (raw, ctx) =>
    round_value(raw, 0, 3, ctx),
  );
}
