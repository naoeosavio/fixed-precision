import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { acot_value } from "../../core/trigonometry/acot";

export function acot(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, acot_value);
}
