import { log10_value } from "../../core/arithmetic/log10";
import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { fromContextValue } from "../../core/construction/value";

export function log10(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, log10_value);
}
