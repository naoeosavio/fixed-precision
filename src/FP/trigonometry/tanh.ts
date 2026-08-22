import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { tanh_value } from "../../core/trigonometry/tanh";

export function tanh(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, tanh_value);
}
