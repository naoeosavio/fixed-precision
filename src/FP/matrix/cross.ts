import { cross_product } from "../../core/matrix/crossProduct";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  resolveContextArrays,
  toScaled,
} from "../construction";

export function cross(
  a: FixedPrecisionOperand[],
  b: FixedPrecisionOperand[],
): FixedPrecisionData[] {
  const ctx = resolveContextArrays(a, b);
  const rawA = a.map((v) => toScaled(v, ctx));
  const rawB = b.map((v) => toScaled(v, ctx));
  return cross_product(rawA, rawB, ctx.SCALE).map((v) =>
    fromRawWithContext(v, ctx),
  );
}

export function crossBy(b: FixedPrecisionOperand[]) {
  return (a: FixedPrecisionOperand[]): FixedPrecisionData[] => cross(a, b);
}
