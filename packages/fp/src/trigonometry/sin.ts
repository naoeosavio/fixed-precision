import { sin_value } from "../../../core/src/core/trigonometry/sin";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function sin(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, sin_value);
}
