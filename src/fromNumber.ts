import FixedPrecision from "./FixedPrecision";

export function fromNumber(value: number): FixedPrecision {
  return new FixedPrecision(value);
}
