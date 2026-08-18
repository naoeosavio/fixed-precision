import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { dot_product } from "./matrix/dotProduct";

export function dot(
  a: FixedPrecisionValue[],
  b: FixedPrecisionValue[],
): FixedPrecision {
  const ctx = FixedPrecision.resolveContext([...a, ...b]);
  const rawA = a.map((v) => FixedPrecision.toScaled(v, ctx));
  const rawB = b.map((v) => FixedPrecision.toScaled(v, ctx));
  return FixedPrecision.fromRawWithContext(
    dot_product(rawA, rawB, ctx.SCALE),
    ctx,
  );
}
