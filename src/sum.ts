import { collectValues } from "./construction/values";
import {
  construct,
  fromRawWithContext,
  normalizeTo,
  registerFunction,
  resolveContext,
  toScaled,
} from "./core/value";
import { sum_values } from "./statistics/sum";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function sum(
  value: FixedPrecisionValue | FixedPrecisionValue[],
  ...values: FixedPrecisionValue[]
): FixedPrecisionLike {
  const all = collectValues(value, values);
  const firstValue = all[0];
  if (firstValue === undefined) {
    return construct(0n);
  }

  const ctx = resolveContext(all);
  const first = normalizeTo(firstValue, ctx);
  const total = sum_values(all.slice(1), first.raw(), (v) => toScaled(v, ctx));
  return fromRawWithContext(total, ctx);
}

registerFunction("sum", sum);
