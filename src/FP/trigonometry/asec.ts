import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { asec_value } from "../../core/trigonometry/asec";

export function asec(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, asec_value);
}
