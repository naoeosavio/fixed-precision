import { cot_value } from "../../../core/src/core/trigonometry/cot";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function cot(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, cot_value);
}
