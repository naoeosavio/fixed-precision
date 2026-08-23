import { dot_product } from "../../core/matrix/dotProduct";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../construction";

export function dot(
  a: FixedPrecisionOperand[],
  b: FixedPrecisionOperand[],
): FixedPrecisionData {
  const ctx = resolveContext([...a, ...b]);
  const rawA = a.map((v) => toScaled(v, ctx));
  const rawB = b.map((v) => toScaled(v, ctx));
  return fromRawWithContext(dot_product(rawA, rawB, ctx.SCALE), ctx);
}
