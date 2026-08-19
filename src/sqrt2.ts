import { construct, registerFunction } from "./core/value";
import type { FixedPrecisionLike } from "./types";

export function sqrt2(): FixedPrecisionLike {
  return construct("1.41421356237309504880");
}

registerFunction("sqrt2", sqrt2);
