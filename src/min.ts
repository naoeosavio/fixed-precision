import { collectValues } from "./construction/values";
import { normalizeTo, registerFunction, resolveContext } from "./core/value";
import { lessThan } from "./lessThan";
import { min_values } from "./statistics/min";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function min(
  value: FixedPrecisionValue | FixedPrecisionValue[],
  ...values: FixedPrecisionValue[]
): FixedPrecisionLike {
  const all = collectValues(value, values);
  const ctx = resolveContext(all);
  return min_values(
    all,
    (v) => normalizeTo(v, ctx),
    (left, right) => lessThan(left, right),
  );
}

registerFunction("min", min);
