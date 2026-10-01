import { round_value } from "../../../core/src/core/arithmetic/round";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function floor(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, (raw, ctx) => round_value(raw, 0, 3, ctx));
}
