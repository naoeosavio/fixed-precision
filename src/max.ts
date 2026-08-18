import { collectValues } from "./construction/values";
import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { greaterThan } from "./greaterThan";
import { max_values } from "./statistics/max";

export function max(
  value: FixedPrecisionValue | FixedPrecisionValue[],
  ...values: FixedPrecisionValue[]
): FixedPrecision {
  const all = collectValues(value, values);
  const ctx = FixedPrecision.resolveContext(all);
  return max_values(
    all,
    (v) => FixedPrecision.normalizeTo(v, ctx),
    (left, right) => greaterThan(left, right),
  );
}
