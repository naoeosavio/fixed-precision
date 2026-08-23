import { acos_value } from "../../core/trigonometry/acos";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function acos(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, acos_value);
}
