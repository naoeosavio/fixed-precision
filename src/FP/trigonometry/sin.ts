import { sin_value } from "../../core/trigonometry/sin";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function sin(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, sin_value);
}
