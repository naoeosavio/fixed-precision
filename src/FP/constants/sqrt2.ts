import type { FixedPrecisionData } from "../../core/construction/types";
import { construct } from "../../core/construction/value";

export function sqrt2(): FixedPrecisionData {
  return construct("1.41421356237309504880");
}
