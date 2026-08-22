import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { atanh_value } from "../../core/trigonometry/atanh";

export function atanh(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, atanh_value);
}
