import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { compareValues } from "./relational/compare";

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
    return compareValues(
      FixedPrecision.toScaled(value, FixedPrecision.resolveContext([])),
      0n,
    );
  } catch {
    return numericValue < 0 ? -1 : 1;
  }
}

export function sign(value: FixedPrecisionValue): number {
  if (value instanceof FixedPrecision) {
    return compareValues(value.raw(), 0n);
  }

  if (typeof value === "bigint") {
    return compareValues(value, 0n);
  }

  if (typeof value === "number") {
    return signNumber(value);
  }

  return signString(value);
}
