import type { FixedPrecisionData } from "../../core/construction/types";
import { construct } from "../../core/construction/value";

export function fromString(value: string): FixedPrecisionData {
  return construct(value);
}
