import { acot_value } from "../../core/trigonometry/acot";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function acot(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, acot_value);
}
