import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../construction";

export function subtract(
  value: FixedPrecisionOperand,
  amount: FixedPrecisionOperand,
): FixedPrecisionData {
  const ctx = resolveContext([value, amount]);
  return fromRawWithContext(toScaled(value, ctx) - toScaled(amount, ctx), ctx);
}
