export const FP_BRAND: unique symbol = Symbol("fixed-precision");

export type RoundingMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Comparison = -1 | 0 | 1;

export type FPContext = {
  places: number;
  roundingMode: RoundingMode;
  SCALE: bigint;
  SCALENUMBER: number;
};

export type FixedPrecisionConfig = {
  places: number;
  roundingMode?: RoundingMode;
};

export interface FixedPrecisionLike {
  readonly [FP_BRAND]: true;

  context(): FPContext;
  raw(): bigint;

  toNumber(places?: number): number;
  toString(trimZeros?: boolean): string;

  abs(): FixedPrecisionLike;
  cmp(other: FixedPrecisionValue): Comparison;
  eq(other: FixedPrecisionValue): boolean;
  gt(other: FixedPrecisionValue): boolean;
  gte(other: FixedPrecisionValue): boolean;
  lt(other: FixedPrecisionValue): boolean;
  lte(other: FixedPrecisionValue): boolean;
  cmpRaw(other: FixedPrecisionValue): Comparison;
  eqRaw(other: FixedPrecisionValue): boolean;
  gtRaw(other: FixedPrecisionValue): boolean;
  gteRaw(other: FixedPrecisionValue): boolean;
  ltRaw(other: FixedPrecisionValue): boolean;
  lteRaw(other: FixedPrecisionValue): boolean;

  isZero(): boolean;
  isPositive(): boolean;
  isNegative(): boolean;
  not(): boolean;
  and(other: FixedPrecisionValue): boolean;
  or(other: FixedPrecisionValue): boolean;
  xor(other: FixedPrecisionValue): boolean;
  isInteger(): boolean;

  places(): number;
  decimalPlaces(): number;
  precision(includeZeros?: boolean): number;
  sd(includeZeros?: boolean): number;

  add(other: FixedPrecisionValue): FixedPrecisionLike;
  plus(other: FixedPrecisionValue): FixedPrecisionLike;
  sub(other: FixedPrecisionValue): FixedPrecisionLike;
  minus(other: FixedPrecisionValue): FixedPrecisionLike;
  mul(other: FixedPrecisionValue): FixedPrecisionLike;
  times(other: FixedPrecisionValue): FixedPrecisionLike;
  div(other: FixedPrecisionValue): FixedPrecisionLike;
  ratio(other: FixedPrecisionValue): FixedPrecisionLike;
  mod(other: FixedPrecisionValue): FixedPrecisionLike;
  rem(other: FixedPrecisionValue): FixedPrecisionLike;
  idiv(other: FixedPrecisionValue): FixedPrecisionLike;
  divmod(other: FixedPrecisionValue): {
    quotient: FixedPrecisionLike;
    remainder: FixedPrecisionLike;
  };
  idivmod(other: FixedPrecisionValue): {
    quotient: FixedPrecisionLike;
    remainder: FixedPrecisionLike;
  };
  rest(other: FixedPrecisionValue): FixedPrecisionLike;
  dividedToIntegerBy(other: FixedPrecisionValue): FixedPrecisionLike;

  clamp(min: FixedPrecisionValue, max: FixedPrecisionValue): FixedPrecisionLike;
  clampedTo(
    min: FixedPrecisionValue,
    max: FixedPrecisionValue,
  ): FixedPrecisionLike;
  toNearest(
    increment: FixedPrecisionValue,
    rm?: RoundingMode,
  ): FixedPrecisionLike;

  bitAnd(other: FixedPrecisionValue): FixedPrecisionLike;
  bitOr(other: FixedPrecisionValue): FixedPrecisionLike;
  bitXor(other: FixedPrecisionValue): FixedPrecisionLike;
  bitNot(): FixedPrecisionLike;
  leftShift(n: number): FixedPrecisionLike;
  rightArithShift(n: number): FixedPrecisionLike;

  neg(): FixedPrecisionLike;
  pow(exp: number): FixedPrecisionLike;
  square(): FixedPrecisionLike;
  cube(): FixedPrecisionLike;
  sqrt(): FixedPrecisionLike;
  cbrt(): FixedPrecisionLike;
  cubeRoot(): FixedPrecisionLike;

  ln(): FixedPrecisionLike;
  log(base?: FixedPrecisionValue): FixedPrecisionLike;
  log10(): FixedPrecisionLike;
  log2(): FixedPrecisionLike;
  exp(): FixedPrecisionLike;

  sin(): FixedPrecisionLike;
  cos(): FixedPrecisionLike;
  tan(): FixedPrecisionLike;
  sec(): FixedPrecisionLike;
  csc(): FixedPrecisionLike;
  cot(): FixedPrecisionLike;
  asin(): FixedPrecisionLike;
  acos(): FixedPrecisionLike;
  atan(): FixedPrecisionLike;
  atan2(x: FixedPrecisionValue): FixedPrecisionLike;
  acot(): FixedPrecisionLike;
  asec(): FixedPrecisionLike;
  acsc(): FixedPrecisionLike;
  sinh(): FixedPrecisionLike;
  cosh(): FixedPrecisionLike;
  tanh(): FixedPrecisionLike;
  sech(): FixedPrecisionLike;
  csch(): FixedPrecisionLike;
  coth(): FixedPrecisionLike;
  asinh(): FixedPrecisionLike;
  acosh(): FixedPrecisionLike;
  atanh(): FixedPrecisionLike;
  asech(): FixedPrecisionLike;
  acsch(): FixedPrecisionLike;
  acoth(): FixedPrecisionLike;

  num(): FixedPrecisionLike;
  den(): FixedPrecisionLike;
  fraction(
    maxDen?: FixedPrecisionValue,
  ): [FixedPrecisionLike, FixedPrecisionLike];

  round(dp?: number, rm?: RoundingMode): FixedPrecisionLike;
  scale(newScale: number, rm?: RoundingMode): FixedPrecisionLike;
  prec(sd: number, rm?: RoundingMode): FixedPrecisionLike;
  ceil(): FixedPrecisionLike;
  floor(): FixedPrecisionLike;
  trunc(): FixedPrecisionLike;
  shiftedBy(n: number): FixedPrecisionLike;

  toExponential(dp?: number, rm?: RoundingMode): string;
  toPrecision(sd: number, rm?: RoundingMode): string;
  toFixed(places?: number, rm?: RoundingMode): string;
  toBinary(sd?: number, rm?: RoundingMode): string;
  toOctal(sd?: number, rm?: RoundingMode): string;
  toHex(sd?: number, rm?: RoundingMode): string;
  toHexadecimal(sd?: number, rm?: RoundingMode): string;
  toBase(base: 2 | 8 | 16, sd?: number, rm?: RoundingMode): string;

  toJSON(): string;
  valueOf(): string;
  typeof(): "FixedPrecision";
}

export type FixedPrecisionValue = string | number | bigint | FixedPrecisionLike;
