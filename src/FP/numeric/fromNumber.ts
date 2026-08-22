import type { FixedPrecisionData } from "../../core/construction/types";
import { construct } from "../../core/construction/value";

export function fromNumber(value: number): FixedPrecisionData {
  return construct(value);
}
