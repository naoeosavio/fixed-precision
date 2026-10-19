import {
  construct,
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  normalizeTo,
  resolveContext,
} from "../construction";

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
