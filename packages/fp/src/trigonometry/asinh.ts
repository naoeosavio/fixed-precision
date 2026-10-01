import { asinh_value } from "../../../core/src/core/trigonometry/asinh";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function asinh(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, asinh_value);
}
