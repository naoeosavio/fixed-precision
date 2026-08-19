import { makeContext } from "./core/context";
import {
  fromRawWithContext,
  getDefaultContext,
  registerFunction,
} from "./core/value";
import type { FixedPrecisionLike } from "./types";

export function random(decimalPlaces?: number): FixedPrecisionLike {
  const defaultCtx = getDefaultContext();
  const dec = decimalPlaces ?? defaultCtx.places;
  let rand = 0n;
  for (let i = 0; i < dec; i++) {
    rand = rand * 10n + BigInt(Math.floor(Math.random() * 10));
  }

  return fromRawWithContext(rand, makeContext(dec, defaultCtx.roundingMode));
}

registerFunction("random", random);
