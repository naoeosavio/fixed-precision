import type { FixedPrecisionLike, FixedPrecisionValue } from "../types";

export const FP_BRAND: unique symbol = Symbol("fixed-precision");

export type RoundingMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Comparison = -1 | 0 | 1;

export type FPContext = {
  places: number;
  roundingMode: RoundingMode;
  SCALE: bigint;
  SCALENUMBER: number;
};

export type FixedPrecisionData = {
  places: number;
  roundingMode: RoundingMode;
  SCALE: bigint;
  SCALENUMBER: number;
  value: bigint;
};

export type FixedPrecisionConfig = {
  places: number;
  roundingMode?: RoundingMode;
};

export interface FixedPrecisionCoreLike {
  readonly [FP_BRAND]: true;

  context(): FPContext;
  raw(): bigint;

  toString(trimZeros?: boolean): string;

  places(): number;
  decimalPlaces(): number;
  sd(includeZeros?: boolean): number;
  isInteger(): boolean;

  plus(other: FixedPrecisionValue): FixedPrecisionLike;
  minus(other: FixedPrecisionValue): FixedPrecisionLike;
  times(other: FixedPrecisionValue): FixedPrecisionLike;
  ratio(other: FixedPrecisionValue): FixedPrecisionLike;
  rem(other: FixedPrecisionValue): FixedPrecisionLike;
  rest(other: FixedPrecisionValue): FixedPrecisionLike;
  dividedToIntegerBy(other: FixedPrecisionValue): FixedPrecisionLike;
  clampedTo(
    min: FixedPrecisionValue,
    max: FixedPrecisionValue,
  ): FixedPrecisionLike;
  cubeRoot(): FixedPrecisionLike;
  prec(sd: number, rm?: RoundingMode): FixedPrecisionLike;

  cmpRaw(other: FixedPrecisionValue): Comparison;
  eqRaw(other: FixedPrecisionValue): boolean;
  gtRaw(other: FixedPrecisionValue): boolean;
  gteRaw(other: FixedPrecisionValue): boolean;
  ltRaw(other: FixedPrecisionValue): boolean;
  lteRaw(other: FixedPrecisionValue): boolean;

  toJSON(): string;
  valueOf(): string;
  typeof(): "FixedPrecision";
}
