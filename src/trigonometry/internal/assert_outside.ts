import type { FPContext } from "../../FixedPrecision";

export function assert_outside_minus_one_to_one(
  value: bigint,
  ctx: FPContext,
  name: string,
): void {
  if (value > -ctx.SCALE && value < ctx.SCALE) {
    throw new Error(
      `${name} is defined for absolute values greater than or equal to 1`,
    );
  }
}
