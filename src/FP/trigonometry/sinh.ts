import { sinh_value } from "../../core/trigonometry/sinh";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function sinh(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, sinh_value);
}
