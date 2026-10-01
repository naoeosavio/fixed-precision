import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromContextValue,
} from "../construction";

export function abs(value: FixedPrecisionOperand): FixedPrecisionData {
  return fromContextValue(value, (raw) => (raw < 0n ? -raw : raw));
}
