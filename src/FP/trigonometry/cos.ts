import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { cos_value } from "../../core/trigonometry/cos";

export function cos(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, cos_value);
}
