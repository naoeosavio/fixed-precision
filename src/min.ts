import { collectValues } from "./construction/values";
import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { lessThan } from "./lessThan";
import { min_values } from "./statistics/min";

export function min(
  value: FixedPrecisionValue | FixedPrecisionValue[],
  ...values: FixedPrecisionValue[]
): FixedPrecision {
  const all = collectValues(value, values);
  const ctx = FixedPrecision.resolveContext(all);
  return min_values(
    all,
    (v) => FixedPrecision.normalizeTo(v, ctx),
    (left, right) => lessThan(left, right),
  );
}
