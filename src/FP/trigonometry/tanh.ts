import { tanh_value } from "../../core/trigonometry/tanh";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function tanh(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, tanh_value);
}
