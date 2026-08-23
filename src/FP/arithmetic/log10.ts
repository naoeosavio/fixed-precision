import { log10_value } from "../../core/arithmetic/log10";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function log10(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, log10_value);
}
