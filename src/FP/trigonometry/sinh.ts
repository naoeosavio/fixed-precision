import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { sinh_value } from "../../core/trigonometry/sinh";

export function sinh(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, sinh_value);
}
