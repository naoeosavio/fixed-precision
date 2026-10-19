import { sec_value } from "../../../core/src/core/trigonometry/sec";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function sec(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, sec_value);
}
