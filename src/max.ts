import { collectValues } from "./construction/values";
import { normalizeTo, registerFunction, resolveContext } from "./core/value";
import { greaterThan } from "./greaterThan";
import { max_values } from "./statistics/max";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function max(
  value: FixedPrecisionValue | FixedPrecisionValue[],
  ...values: FixedPrecisionValue[]
): FixedPrecisionLike {
  const all = collectValues(value, values);
  const ctx = resolveContext(all);
  return max_values(
    all,
    (v) => normalizeTo(v, ctx),
    (left, right) => greaterThan(left, right),
  );
}

registerFunction("max", max);
