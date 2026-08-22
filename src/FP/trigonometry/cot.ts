import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { cot_value } from "../../core/trigonometry/cot";

export function cot(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, cot_value);
}
