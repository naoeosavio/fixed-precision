import {
  fromRawWithContext,
  registerFunction,
  resolveContext,
  toScaled,
} from "./core/value";
import { dot_product } from "./matrix/dotProduct";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function dot(
  a: FixedPrecisionValue[],
  b: FixedPrecisionValue[],
): FixedPrecisionLike {
  const ctx = resolveContext([...a, ...b]);
  const rawA = a.map((v) => toScaled(v, ctx));
  const rawB = b.map((v) => toScaled(v, ctx));
  return fromRawWithContext(dot_product(rawA, rawB, ctx.SCALE), ctx);
}

registerFunction("dot", dot);
