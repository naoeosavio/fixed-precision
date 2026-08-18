import { collectValues } from "./construction/values";
import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { sum_values } from "./statistics/sum";

export function sum(
  value: FixedPrecisionValue | FixedPrecisionValue[],
  ...values: FixedPrecisionValue[]
): FixedPrecision {
  const all = collectValues(value, values);
  const firstValue = all[0];
  if (firstValue === undefined) {
    return new FixedPrecision(0n);
  }

  const ctx = FixedPrecision.resolveContext(all);
  const first = FixedPrecision.normalizeTo(firstValue, ctx);
  const total = sum_values(all.slice(1), first.raw(), (v) =>
    FixedPrecision.toScaled(v, ctx),
  );
  return FixedPrecision.fromRawWithContext(total, ctx);
}
