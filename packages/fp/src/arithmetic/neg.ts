import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function neg(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, (raw) => -raw);
}
