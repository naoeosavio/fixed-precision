import type {
  FixedPrecisionConfig,
  FPContext,
  RoundingMode,
} from "../FixedPrecision";
import { powerOfTen } from "../utils";

export function makeContext(
  places: number,
  roundingMode: RoundingMode,
): FPContext {
  return {
    places,
    roundingMode,
    SCALE: powerOfTen(places),
    SCALENUMBER: 10 ** places,
  };
}

function assertPlaces(places: number): void {
  if (!Number.isInteger(places) || places < 0 || places > 20) {
    throw new Error("Decimal places must be an integer between 0 and 20");
  }
}

function assertRoundingMode(value: number): asserts value is RoundingMode {
  if (!Number.isInteger(value) || value < 0 || value > 8) {
    throw new Error(
      "Invalid rounding mode. Must be 0, 1, 2, 3, 4, 5, 6, 7 or 8",
    );
  }
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

export function makeFactoryContext(config: FixedPrecisionConfig): FPContext {
  if (config.places === undefined) {
    throw new Error("Decimal places must be specified in factory config");
  }

  assertPlaces(config.places);

  const roundingMode = config.roundingMode ?? 4;
  assertRoundingMode(roundingMode);

  return makeContext(config.places, roundingMode);
}
