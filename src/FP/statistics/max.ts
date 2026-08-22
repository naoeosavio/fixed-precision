import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { normalizeTo, resolveContext } from "../../core/construction/value";
import { greaterThan } from "../relational/greaterThan";

export function max(
  value: FixedPrecisionOperand | FixedPrecisionOperand[],
  ...values: FixedPrecisionOperand[]
): FixedPrecisionData {
  const items = Array.isArray(value)
    ? [...value, ...values]
    : [value, ...values];
  const first = items[0];
  if (first === undefined) {
    throw new Error("max requires at least one argument");
  }
  const ctx = resolveContext(items);
  let result = normalizeTo(first, ctx);
  for (const item of items.slice(1)) {
    const next = normalizeTo(item, ctx);
    if (greaterThan(next, result)) result = next;
  }
  return result;
}
