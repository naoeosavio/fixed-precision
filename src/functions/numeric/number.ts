import type { FPContext } from "../../FixedPrecision";
import { toStringWithCtx } from "../string/format";

const MAX_SAFE_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);

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
  if (value <= MAX_SAFE_BIGINT && value >= -MAX_SAFE_BIGINT) {
    return Number(value) / ctx.SCALENUMBER;
  }

  if (ctx.places < 15) {
    return toNumberByParts(value, ctx);
  }

  return Number(toStringWithCtx(value, ctx));
}

function toNumberByParts(value: bigint, ctx: FPContext): number {
  const intPart = value / ctx.SCALE;
  const fracPart = value - intPart * ctx.SCALE;
  if (fracPart === 0n) {
    return Number(intPart);
  }

  return Number(intPart) + Number(fracPart) / ctx.SCALENUMBER;
}
