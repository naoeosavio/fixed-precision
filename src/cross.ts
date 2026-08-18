import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { cross_product } from "./matrix/crossProduct";

export function cross(
  a: FixedPrecisionValue[],
  b: FixedPrecisionValue[],
): FixedPrecision[] {
  const ctx = FixedPrecision.resolveContext([...a, ...b]);
  const rawA = a.map((v) => FixedPrecision.toScaled(v, ctx));
  const rawB = b.map((v) => FixedPrecision.toScaled(v, ctx));
  return cross_product(rawA, rawB, ctx.SCALE).map((v) =>
    FixedPrecision.fromRawWithContext(v, ctx),
  );
}
