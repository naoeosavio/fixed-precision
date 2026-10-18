import {
  assertPlaces,
  assertRoundingMode,
  DEFAULT_ROUNDING_MODE,
} from "../../../core/src/core/construction/context";
import { powerOfTen } from "../../../core/src/core/utils/powerOfTen";
import type { FixedPrecisionConfig, FPContext, RoundingMode } from "./types";

export function makeContext(
  places: number,
  roundingMode: RoundingMode,
): FPContext {
  assertPlaces(places);
  return {
    places,
    roundingMode,
    SCALE: powerOfTen(places),
    SCALENUMBER: 10 ** places,
  };
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
