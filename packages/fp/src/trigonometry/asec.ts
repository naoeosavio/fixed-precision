import { asec_value } from "../../../core/src/core/trigonometry/asec";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function asec(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, asec_value);
}
