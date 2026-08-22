import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { sin_value } from "../../core/trigonometry/sin";

export function sin(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, sin_value);
}
