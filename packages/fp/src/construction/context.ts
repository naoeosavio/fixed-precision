import {
  assertPlaces,
  assertRoundingMode,
  DEFAULT_ROUNDING_MODE,
} from "../../../core/src/core/construction/context";
import { powerOfTen } from "../../../core/src/core/utils/powerOfTen";
import type { FixedPrecisionConfig, FPContext, RoundingMode } from "./types";

const CONTEXT_CACHE = new Map<number, FPContext>();

export function makeContext(
  places: number,
  roundingMode: RoundingMode,
): FPContext {
  assertPlaces(places);
  const key = places * 16 + roundingMode;
  let cached = CONTEXT_CACHE.get(key);
  if (cached === undefined) {
    cached = {
      places,
      roundingMode,
      SCALE: powerOfTen(places),
      SCALENUMBER: 10 ** places,
    };
    CONTEXT_CACHE.set(key, cached);
  }
  return cached;
}

export function FactoryContext(config: FixedPrecisionConfig): FPContext {
  if (config.places === undefined) {
    throw new Error("Decimal places must be specified in factory config");
  }

  assertPlaces(config.places);

  const roundingMode = config.roundingMode ?? DEFAULT_ROUNDING_MODE;
  assertRoundingMode(roundingMode);

  return makeContext(config.places, roundingMode);
}
