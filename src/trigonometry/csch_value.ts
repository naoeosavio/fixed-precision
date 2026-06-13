import type { FPContext } from "../FixedPrecision";
import { cosh_difference } from "./internal/cosh_difference";
import { reciprocal_value } from "./internal/reciprocal_value";

export function csch_value(value: bigint, ctx: FPContext): bigint {
  return reciprocal_value(
    cosh_difference(value, ctx),
    ctx,
    "Hyperbolic cosecant",
  );
}
