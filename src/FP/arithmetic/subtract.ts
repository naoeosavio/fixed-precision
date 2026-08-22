import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import {
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../../core/construction/value";

export function subtract(
  value: FixedPrecisionOperand,
  amount: FixedPrecisionOperand,
): FixedPrecisionData {
  const ctx = resolveContext([value, amount]);
  return fromRawWithContext(toScaled(value, ctx) - toScaled(amount, ctx), ctx);
}
