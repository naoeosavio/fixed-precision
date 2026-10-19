import { tan_value } from "../../../core/src/core/trigonometry/tan";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function tan(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, tan_value);
}
