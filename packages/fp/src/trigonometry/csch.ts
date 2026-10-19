import { csch_value } from "../../../core/src/core/trigonometry/csch";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function csch(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, csch_value);
}
