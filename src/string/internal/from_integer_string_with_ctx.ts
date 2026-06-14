import type { FPContext } from "../../FixedPrecision";
import { powerOfTen } from "../../utils";

export function from_integer_string_with_ctx(
  str: string,
  P: number,
  ctx: FPContext,
): bigint {
  const lens = str.length;
  if (P < 16) {
    return from_small_scale_integer_string_with_ctx(str, lens, P, ctx);
  }

  return from_large_scale_integer_string_with_ctx(str, lens, ctx);
}

function from_small_scale_integer_string_with_ctx(
  str: string,
  lens: number,
  P: number,
  ctx: FPContext,
): bigint {
  const SCALE_NUM = ctx.SCALENUMBER;
  if (lens + P < 16) {
    const num = Number(str);
    return BigInt(num * SCALE_NUM);
  }
  if (lens < 16) {
    return from_short_integer_string_with_ctx(str, lens, P, ctx);
  }

  const num = BigInt(str);
  return num * ctx.SCALE;
}

function from_short_integer_string_with_ctx(
  str: string,
  lens: number,
  P: number,
  ctx: FPContext,
): bigint {
  const SCALE_NUM = ctx.SCALENUMBER;
  const num = Number(str);
  if (!Number.isFinite(num)) {
    return BigInt(str) * ctx.SCALE;
  }
  if (Math.abs(num) <= Number.MAX_SAFE_INTEGER / SCALE_NUM) {
    return BigInt(num * SCALE_NUM);
  }

  const nP = 16 - lens;
  if (nP >= P) {
    return BigInt(num * SCALE_NUM);
  }
  return BigInt(num * 10 ** nP) * powerOfTen(P - nP);
}

function from_large_scale_integer_string_with_ctx(
  str: string,
  lens: number,
  ctx: FPContext,
): bigint {
  if (lens < 16) {
    const num = Number(str);
    return BigInt(num) * ctx.SCALE;
  }
  const num = BigInt(str);
  return num * ctx.SCALE;
}
