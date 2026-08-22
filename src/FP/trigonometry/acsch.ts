import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { acsch_value } from "../../core/trigonometry/acsch";

export function acsch(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, acsch_value);
}
