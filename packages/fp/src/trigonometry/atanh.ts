import { atanh_value } from "../../../core/src/core/trigonometry/atanh";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function atanh(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, atanh_value);
}
