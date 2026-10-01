import { construct, type FixedPrecisionData } from "../construction";

export function fromNumber(value: number): FixedPrecisionData {
  return construct(value);
}
