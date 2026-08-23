import { compareValues } from "../../core/relational/compare";
import {
  type FixedPrecisionOperand,
  getDefaultContext,
  isFixedPrecisionData,
  toScaled,
} from "../construction";

function signNumber(value: number): number {
  if (Number.isNaN(value)) {
    return NaN;
  }

  return value === 0 ? value : value < 0 ? -1 : 1;
}

function signString(value: string): number {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return NaN;
  }

  if (numericValue === 0) {
    return value.trim().startsWith("-") ? -0 : 0;
  }

  try {
    return compareValues(toScaled(value, getDefaultContext()), 0n);
  } catch {
    return numericValue < 0 ? -1 : 1;
  }
}

export function sign(value: FixedPrecisionOperand): number {
  if (isFixedPrecisionData(value)) {
    return compareValues(value.value, 0n);
  }

  if (typeof value === "bigint") {
    return compareValues(value, 0n);
  }

  if (typeof value === "number") {
    return signNumber(value);
  }

  return signString(value);
}
