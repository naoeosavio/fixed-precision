import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { atan_value } from "../../core/trigonometry/atan";

export function atan(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, atan_value);
}
