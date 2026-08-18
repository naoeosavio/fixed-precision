import { round_value } from "./arithmetic/round";
import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function ceil(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, (raw, ctx) =>
    round_value(raw, 0, 2, ctx),
  );
}
