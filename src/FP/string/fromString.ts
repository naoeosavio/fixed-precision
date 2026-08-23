import { construct, type FixedPrecisionData } from "../construction";

export function fromString(value: string): FixedPrecisionData {
  return construct(value);
}
