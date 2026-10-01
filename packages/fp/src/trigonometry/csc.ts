import { csc_value } from "../../../core/src/core/trigonometry/csc";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function csc(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, csc_value);
}
