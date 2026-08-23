import { shifted_by_value } from "../../core/arithmetic/shiftedBy";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../construction";

export function shiftedBy(
  value: FixedPrecisionOperand,
  n: number,
): FixedPrecisionData {
  const ctx = resolveContext([value]);
  return fromRawWithContext(shifted_by_value(toScaled(value, ctx), n), ctx);
}
