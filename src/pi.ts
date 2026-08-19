import { construct, registerFunction } from "./core/value";
import type { FixedPrecisionLike } from "./types";

export function pi(): FixedPrecisionLike {
  return construct("3.14159265358979323846");
}

registerFunction("pi", pi);
