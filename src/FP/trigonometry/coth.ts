import { coth_value } from "../../core/trigonometry/coth";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function coth(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, coth_value);
}
