import type { FPContext } from "../FixedPrecision";
import { acosh_value } from "./acosh_value";

export function asech_value(value: bigint, ctx: FPContext): bigint {
  if (value <= 0n || value > ctx.SCALE) {
    throw new Error(
      "Hyperbolic arcsecant is defined for values greater than 0 and less than or equal to 1",
    );
  }

  return acosh_value((ctx.SCALE * ctx.SCALE) / value, ctx);
}
