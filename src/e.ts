import { construct, registerFunction } from "./core/value";
import type { FixedPrecisionLike } from "./types";

export function e(): FixedPrecisionLike {
  return construct("2.71828182845904523536");
}

registerFunction("e", e);
