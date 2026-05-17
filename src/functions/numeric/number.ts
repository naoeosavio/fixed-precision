import type { FPContext } from "../../FixedPrecision";

export function fromNumberWithCtx(value: number, ctx: FPContext): bigint {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error("Invalid number: value must be a finite number.");
  }
  const scaled = value * ctx.SCALENUMBER;
  if (Math.abs(scaled) > Number.MAX_SAFE_INTEGER) {
    if (Number.isInteger(value)) {
      return BigInt(value) * ctx.SCALE;
    }

    const num = Math.trunc(value);
    const nNum = Math.abs(num - value);
    const nScaled = BigInt(Math.trunc(nNum * ctx.SCALENUMBER));
    return BigInt(num) * ctx.SCALE + nScaled;
  }
  return BigInt(Math.trunc(scaled));
}

export function toNumberWithCtx(value: bigint, ctx: FPContext): number {
  return Number(value) / ctx.SCALENUMBER;
}
