import type { FixedPrecisionData } from "../../core/construction/types";
import { construct } from "../../core/construction/value";

export function phi(): FixedPrecisionData {
  return construct("1.61803398874989484820");
}
