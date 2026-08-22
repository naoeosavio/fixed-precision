import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { asinh_value } from "../../core/trigonometry/asinh";

export function asinh(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, asinh_value);
}
