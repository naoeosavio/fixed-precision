import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { coth_value } from "../../core/trigonometry/coth";

export function coth(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, coth_value);
}
