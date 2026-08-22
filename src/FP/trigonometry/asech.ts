import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { asech_value } from "../../core/trigonometry/asech";

export function asech(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, asech_value);
}
