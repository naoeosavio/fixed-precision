import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import {
  construct,
  fromRawWithContext,
  normalizeTo,
  resolveContext,
} from "../../core/construction/value";

export function sum(
  value: FixedPrecisionOperand | FixedPrecisionOperand[],
  ...values: FixedPrecisionOperand[]
): FixedPrecisionData {
  const items = Array.isArray(value)
    ? [...value, ...values]
    : [value, ...values];
  const first = items[0];
  if (first === undefined) {
    return construct(0n);
  }
  const ctx = resolveContext(items);
  let total = 0n;
  for (const item of items) {
    total += normalizeTo(item, ctx).value;
  }

  return fromRawWithContext(total, ctx);
}
