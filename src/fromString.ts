import FixedPrecision from "./FixedPrecision";

export function fromString(value: string): FixedPrecision {
  return new FixedPrecision(value);
}
