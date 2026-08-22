import { makeContext } from "../../core/construction/context";
import type { FixedPrecisionData } from "../../core/construction/types";
import {
  fromRawWithContext,
  getDefaultContext,
} from "../../core/construction/value";

export function random(decimalPlaces?: number): FixedPrecisionData {
  const defaultCtx = getDefaultContext();
  const dec = decimalPlaces ?? defaultCtx.places;
  let rand = 0n;
  for (let i = 0; i < dec; i++) {
    rand = rand * 10n + BigInt(Math.floor(Math.random() * 10));
  }

  return fromRawWithContext(rand, makeContext(dec, defaultCtx.roundingMode));
}
