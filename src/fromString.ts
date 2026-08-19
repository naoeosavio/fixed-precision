import { construct } from "./core/value";
import type { FixedPrecisionLike } from "./types";

export function fromString(value: string): FixedPrecisionLike {
  return construct(value);
}
