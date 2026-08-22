import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { acos_value } from "../../core/trigonometry/acos";

export function acos(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, acos_value);
}
