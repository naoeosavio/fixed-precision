import { shifted_by_value } from "../../core/arithmetic/shiftedBy";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  resolveContextSingle,
  toScaled,
} from "../construction";

export function shift(
  value: FixedPrecisionOperand,
  n: number,
): FixedPrecisionData {
  const ctx = resolveContextSingle(value);
  return fromRawWithContext(shifted_by_value(toScaled(value, ctx), n), ctx);
}
