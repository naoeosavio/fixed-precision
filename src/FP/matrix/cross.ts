import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import {
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../../core/construction/value";
import { cross_product } from "../../core/matrix/crossProduct";

export function cross(
  a: FixedPrecisionOperand[],
  b: FixedPrecisionOperand[],
): FixedPrecisionData[] {
  const ctx = resolveContext([...a, ...b]);
  const rawA = a.map((v) => toScaled(v, ctx));
  const rawB = b.map((v) => toScaled(v, ctx));
  return cross_product(rawA, rawB, ctx.SCALE).map((v) =>
    fromRawWithContext(v, ctx),
  );
}
