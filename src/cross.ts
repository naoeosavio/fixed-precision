import {
  fromRawWithContext,
  registerFunction,
  resolveContext,
  toScaled,
} from "./core/value";
import { cross_product } from "./matrix/crossProduct";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function cross(
  a: FixedPrecisionValue[],
  b: FixedPrecisionValue[],
): FixedPrecisionLike[] {
  const ctx = resolveContext([...a, ...b]);
  const rawA = a.map((v) => toScaled(v, ctx));
  const rawB = b.map((v) => toScaled(v, ctx));
  return cross_product(rawA, rawB, ctx.SCALE).map((v) =>
    fromRawWithContext(v, ctx),
  );
}

registerFunction("cross", cross);
