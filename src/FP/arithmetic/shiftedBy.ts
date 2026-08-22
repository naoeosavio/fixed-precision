import { shifted_by_value } from "../../core/arithmetic/shiftedBy";
import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import {
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../../core/construction/value";

export function shiftedBy(
  value: FixedPrecisionOperand,
  n: number,
): FixedPrecisionData {
  const ctx = resolveContext([value]);
  return fromRawWithContext(shifted_by_value(toScaled(value, ctx), n), ctx);
}
