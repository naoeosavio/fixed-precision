import { sqrt_value } from "../../core/arithmetic/sqrt";
import {
  construct,
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../construction";

export function hypot(
  value?: FixedPrecisionOperand | FixedPrecisionOperand[],
  ...values: FixedPrecisionOperand[]
): FixedPrecisionData {
  if (value === undefined) {
    return construct(0n);
  }

  const items = Array.isArray(value)
    ? [...value, ...values]
    : [value, ...values];
  const ctx = resolveContext(items);
  let total = 0n;
  for (const v of items) {
    const raw = toScaled(v, ctx);
    total += (raw * raw) / ctx.SCALE;
  }
  return fromRawWithContext(sqrt_value(total, ctx.SCALE), ctx);
}
