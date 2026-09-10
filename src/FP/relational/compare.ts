import { compareValues } from "../../core/relational/compare";
import {
  type Comparison,
  type FixedPrecisionOperand,
  isFixedPrecisionData,
  resolveContextPair,
  toScaled,
} from "../construction";

export function compare(
  value: FixedPrecisionOperand,
  other: FixedPrecisionOperand,
): Comparison {
  if (
    isFixedPrecisionData(value) &&
    isFixedPrecisionData(other) &&
    value.places === other.places &&
    value.roundingMode === other.roundingMode
  ) {
    return compareValues(value.value, other.value);
  }
  const ctx = resolveContextPair(value, other);
  return compareValues(toScaled(value, ctx), toScaled(other, ctx));
}
