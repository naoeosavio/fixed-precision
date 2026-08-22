import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { sech_value } from "../../core/trigonometry/sech";

export function sech(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, sech_value);
}
