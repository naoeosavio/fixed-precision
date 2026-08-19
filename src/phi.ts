import { construct, registerFunction } from "./core/value";
import type { FixedPrecisionLike } from "./types";

export function phi(): FixedPrecisionLike {
  return construct("1.61803398874989484820");
}

registerFunction("phi", phi);
