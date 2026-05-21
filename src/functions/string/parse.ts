import type { FPContext } from "../../FixedPrecision";
import { powerOfTen } from "../utils";

export function fromStringWithCtx(str: string, ctx: FPContext): bigint {
  const dotIndex = str.indexOf(".", 1);
  const P = ctx.places;
  if (dotIndex === -1) {
    return fromIntegerStringWithCtx(str, P, ctx);
  }
  if (dotIndex + P < 16) {
    return fromShortDecimalStringWithCtx(str, dotIndex, P, ctx);
  }
  return fromLongDecimalStringWithCtx(str, dotIndex, P, ctx);
}

function fromIntegerStringWithCtx(
  str: string,
  P: number,
  ctx: FPContext,
): bigint {
  const lens = str.length;
  if (P < 16) {
    return fromSmallScaleIntegerStringWithCtx(str, lens, P, ctx);
  }

  return fromLargeScaleIntegerStringWithCtx(str, lens, ctx);
}

function fromSmallScaleIntegerStringWithCtx(
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
    return fromShortIntegerStringWithCtx(str, lens, P, ctx);
  }

  const num = BigInt(str);
  return num * ctx.SCALE;
}

function fromShortIntegerStringWithCtx(
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

function fromLargeScaleIntegerStringWithCtx(
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

function fromShortDecimalStringWithCtx(
  str: string,
  dotIndex: number,
  P: number,
  ctx: FPContext,
): bigint {
  const SCALE_NUM = ctx.SCALENUMBER;
  const num = Number(str);
  const nP = 16 - dotIndex;
  const nScaled = num < 0 ? -1 / SCALE_NUM : 1 / SCALE_NUM;

  if (nP >= P) {
    return BigInt(Math.trunc(num * SCALE_NUM + nScaled));
  }

  const Num = num * 10 ** nP;
  const newNum = Math.trunc(Num);
  const NewFrac = Math.trunc(newNum - Num);
  if (!NewFrac) {
    return BigInt(newNum) * powerOfTen(P - nP);
  }
  return BigInt(newNum) * powerOfTen(P - nP) + BigInt(NewFrac);
}

function fromLongDecimalStringWithCtx(
  str: string,
  dotIndex: number,
  P: number,
  ctx: FPContext,
): bigint {
  const intStr = str.slice(0, dotIndex);
  const facStr = str.slice(dotIndex + 1, dotIndex + 1 + P);
  const faclen = facStr.length;
  const newLen = P >= faclen ? P - faclen : P;

  if (dotIndex < 16) {
    return fromLongDecimalWithNumberInteger(
      intStr,
      facStr,
      dotIndex,
      newLen,
      P,
      ctx,
    );
  }

  return fromLongDecimalWithBigInteger(intStr, facStr, newLen, P, ctx.SCALE);
}

function fromLongDecimalWithNumberInteger(
  intStr: string,
  facStr: string,
  dotIndex: number,
  newLen: number,
  P: number,
  ctx: FPContext,
): bigint {
  const int = Number(intStr);
  const SCALE_NUM = ctx.SCALENUMBER;
  if (Math.abs(int) <= Number.MAX_SAFE_INTEGER / SCALE_NUM) {
    return fromLongDecimalWithSafeNumberInteger(
      int,
      facStr,
      newLen,
      P,
      SCALE_NUM,
    );
  }
  if (P < 16) {
    return fromLongDecimalWithSmallScaleNumberInteger(
      int,
      facStr,
      dotIndex,
      newLen,
      P,
      SCALE_NUM,
    );
  }
  return fromLongDecimalWithLargeScaleNumberInteger(
    int,
    facStr,
    newLen,
    SCALE_NUM,
  );
}

function fromLongDecimalWithSafeNumberInteger(
  int: number,
  facStr: string,
  newLen: number,
  P: number,
  SCALE_NUM: number,
): bigint {
  const nNum = int * SCALE_NUM;
  if (P < 16) {
    const frac = Number(facStr);
    const nScaled = BigInt(frac * 10 ** newLen);
    return nNum < 0 ? BigInt(nNum) - nScaled : BigInt(nNum) + nScaled;
  }

  const frac = BigInt(facStr);
  const nScaled = frac * powerOfTen(newLen);
  return nNum < 0 ? BigInt(nNum) - nScaled : BigInt(nNum) + nScaled;
}

function fromLongDecimalWithSmallScaleNumberInteger(
  int: number,
  facStr: string,
  dotIndex: number,
  newLen: number,
  P: number,
  SCALE_NUM: number,
): bigint {
  const frac = Number(facStr);
  const nP = 16 - dotIndex;
  if (nP >= P) {
    return BigInt(int * SCALE_NUM + frac);
  }

  const Num = int * 10 ** nP;
  const nScaled = BigInt(frac * 10 ** newLen);
  return int < 0
    ? BigInt(Num) * powerOfTen(P - nP) - nScaled
    : BigInt(Num) * powerOfTen(P - nP) + nScaled;
}

function fromLongDecimalWithLargeScaleNumberInteger(
  int: number,
  facStr: string,
  newLen: number,
  SCALE_NUM: number,
): bigint {
  const frac = BigInt(facStr);
  if (!frac) {
    return BigInt(int * SCALE_NUM);
  }
  const nScaled = frac * powerOfTen(newLen);
  return int < 0
    ? BigInt(int * SCALE_NUM) - nScaled
    : BigInt(int * SCALE_NUM) + nScaled;
}

function fromLongDecimalWithBigInteger(
  intStr: string,
  facStr: string,
  newLen: number,
  P: number,
  SCALE_BIG: bigint,
): bigint {
  const int = BigInt(intStr);
  if (P < 16) {
    const frac = Number(facStr);
    if (!frac) {
      return int * SCALE_BIG;
    }
    const nScaled = BigInt(frac * 10 ** newLen);
    return int < 0n ? int * SCALE_BIG - nScaled : int * SCALE_BIG + nScaled;
  }
  const frac = BigInt(facStr);
  if (!frac) {
    return int * SCALE_BIG;
  }
  const nScaled = frac * powerOfTen(newLen);
  return int < 0n ? int * SCALE_BIG - nScaled : int * SCALE_BIG + nScaled;
}
