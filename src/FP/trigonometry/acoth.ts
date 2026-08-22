import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";
import { acoth_value } from "../../core/trigonometry/acoth";

export function acoth(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, acoth_value);
}
