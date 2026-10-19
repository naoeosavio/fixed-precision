import { cos_value } from "../../../core/src/core/trigonometry/cos";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function cos(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, cos_value);
}
