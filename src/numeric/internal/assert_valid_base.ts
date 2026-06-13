import type { FPContext } from "../../FixedPrecision";

export function assert_valid_base(base: bigint, ctx: FPContext): void {
  if (base <= 0n || base === ctx.SCALE) {
    throw new Error("Logarithm base must be positive and not equal to 1");
  }
}
