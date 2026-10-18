import type { FPContext } from "../../../FixedPrecision";

export function from_number_with_ctx(value: number, ctx: FPContext): bigint {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error("Invalid number: value must be a finite number.");
  }
  const scaled = value * ctx.SCALENUMBER;
  if (Math.abs(scaled) > Number.MAX_SAFE_INTEGER) {
    if (Number.isInteger(value)) {
      return BigInt(value) * ctx.SCALE;
    }

    const num = Math.trunc(value);
    const frac = value - num;
    const frac_scaled = BigInt(Math.trunc(frac * ctx.SCALENUMBER));
    return BigInt(num) * ctx.SCALE + frac_scaled;
  }
  return BigInt(Math.trunc(scaled));
}
