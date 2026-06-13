import type { FPContext } from "../FixedPrecision";
import { cosh_value } from "./cosh_value";
import { reciprocal_value } from "./internal/reciprocal_value";

export function sech_value(value: bigint, ctx: FPContext): bigint {
  return reciprocal_value(cosh_value(value, ctx), ctx, "Hyperbolic secant");
}
