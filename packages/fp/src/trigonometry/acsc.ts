import { acsc_value } from "../../../core/src/core/trigonometry/acsc";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function acsc(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, acsc_value);
}
