import type { FPContext } from "../../FixedPrecision";

export function assert_between_minus_one_and_one(
  value: bigint,
  ctx: FPContext,
  name: string,
): void {
  if (value < -ctx.SCALE || value > ctx.SCALE) {
    throw new Error(`${name} is defined for values between -1 and 1`);
  }
}
