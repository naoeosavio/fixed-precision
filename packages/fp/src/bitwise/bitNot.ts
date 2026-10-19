import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function bitNot(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, (raw) => ~raw);
}
