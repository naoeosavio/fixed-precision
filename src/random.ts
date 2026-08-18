import { makeContext } from "./core/context";
import FixedPrecision from "./FixedPrecision";

export function random(decimalPlaces?: number): FixedPrecision {
  const defaultCtx = FixedPrecision.resolveContext([]);
  const dec = decimalPlaces ?? defaultCtx.places;
  let rand = 0n;
  for (let i = 0; i < dec; i++) {
    rand = rand * 10n + BigInt(Math.floor(Math.random() * 10));
  }

  return FixedPrecision.fromRawWithContext(
    rand,
    makeContext(dec, defaultCtx.roundingMode),
  );
}
