import type { FixedPrecisionData } from "../../core/construction/types";
import { construct } from "../../core/construction/value";

export function pi(): FixedPrecisionData {
  return construct("3.14159265358979323846");
}
