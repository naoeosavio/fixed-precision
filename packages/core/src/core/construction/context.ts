import { powerOfTen } from "../utils";
import type { FixedPrecisionConfig, FPContext, RoundingMode } from "./types";

export const MAX_PLACES = 20;
export const DEFAULT_ROUNDING_MODE: RoundingMode = 4;

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

export function assertPlaces(places: number): void {
  if (!Number.isInteger(places) || places < 0 || places > MAX_PLACES) {
    throw new Error("Decimal places must be an integer between 0 and 20");
  }
}

export function assertRoundingMode(
  value: number,
): asserts value is RoundingMode {
  if (!Number.isInteger(value) || value < 0 || value > 8) {
    throw new Error(
      "Invalid rounding mode. Must be 0, 1, 2, 3, 4, 5, 6, 7 or 8",
    );
  }
}

export function preferContext(
  best: FPContext | null,
  candidate: FPContext,
): FPContext {
  if (!best) return candidate;
  if (candidate.places !== best.places) {
    return candidate.places > best.places ? candidate : best;
  }
  if (candidate.roundingMode !== best.roundingMode) {
    return candidate.roundingMode < best.roundingMode ? candidate : best;
  }
  return best;
}

export function configureContext(
  config: FixedPrecisionConfig,
  current: FPContext,
): FPContext {
  let { places, roundingMode } = current;

  if (config.places !== undefined) {
    assertPlaces(config.places);
    places = config.places;
  }

  if (config.roundingMode !== undefined) {
    assertRoundingMode(config.roundingMode);
    roundingMode = config.roundingMode;
  }

  return makeContext(places, roundingMode);
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
