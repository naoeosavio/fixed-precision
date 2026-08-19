import { construct } from "./core/value";
import type { FixedPrecisionLike } from "./types";

export function fromNumber(value: number): FixedPrecisionLike {
  return construct(value);
}
