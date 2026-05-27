import {
  absolute,
  add,
  divide,
  modulo,
  multiply,
  negate,
  subtract,
} from "./functions/arithmetic/operations";
import { power } from "./functions/arithmetic/power";
import {
  bitAnd,
  bitNot,
  bitOr,
  bitXor,
  leftShift,
  rightArithShift,
} from "./functions/bitwise";
import {
  combinationsValue,
  factorialValue,
  permutationsValue,
} from "./functions/combinatorics";
import { collectValues } from "./functions/construction/values";
import {
  configureContext,
  makeContext,
  makeFactoryContext,
} from "./functions/core/context";
import { getNumeratorAndDenominator } from "./functions/fraction";
import { cubeRoot, squareRoot } from "./functions/geometry/sqrt";
import {
  isNegativeValue,
  isPositiveValue,
  isZeroValue,
} from "./functions/logical/sign";
import { crossProduct, dotProduct } from "./functions/matrix";
import {
  eNumber,
  phiNumber,
  piNumber,
  sqrt2Number,
} from "./functions/numeric/constants";
import { fromNumberWithCtx, toNumberWithCtx } from "./functions/numeric/number";
import {
  precisionValue,
  significantDigitsValue,
} from "./functions/numeric/precision";
import {
  roundValue,
  scaleValue,
  shiftedByValue,
} from "./functions/numeric/rounding";
import {
  expValue,
  log2Value,
  log10Value,
  logValue,
  naturalLogValue,
} from "./functions/numeric/transcendental";
import { randomDecimalString } from "./functions/probability/random";
import {
  compareValues,
  equalsValue,
  greaterThanOrEqualValue,
  greaterThanValue,
  lessThanOrEqualValue,
  lessThanValue,
} from "./functions/relational/compare";
import {
  selectMax,
  selectMin,
  sumRawValues,
} from "./functions/statistics/aggregate";
import {
  toBaseWithCtx,
  toFixedWithCtx,
  toStringWithCtx,
} from "./functions/string/format";
import { fromStringWithCtx } from "./functions/string/parse";
import {
  acoshValue,
  acosValue,
  acothValue,
  acotValue,
  acschValue,
  acscValue,
  asechValue,
  asecValue,
  asinhValue,
  asinValue,
  atan2Value,
  atanhValue,
  atanValue,
  coshValue,
  cosValue,
  cothValue,
  cotValue,
  cschValue,
  cscValue,
  sechValue,
  secValue,
  sinhValue,
  sinValue,
  tanhValue,
  tanValue,
} from "./functions/trigonometry";

export type RoundingMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Comparison = -1 | 0 | 1;

export type FixedPrecisionValue = string | number | bigint | FixedPrecision;

export type FPContext = {
  places: number;
  roundingMode: RoundingMode;
  SCALE: bigint;
  SCALENUMBER: number;
};

/**
 *  FixedPrecision Configuration System
 */
export interface FixedPrecisionConfig {
  /**
   * Number of decimal places to use (0-20)
   * @default 8
   */
  places: number;

  /**
   * Default rounding mode for decimal operations:
   * 0: ROUND_UP
   * 1: ROUND_DOWN
   * 2: ROUND_CEIL
   * 3: ROUND_FLOOR
   * 4: ROUND_HALF_UP
   * 5: ROUND_HALF_DOWN
   * 6: ROUND_HALF_EVEN
   * 7: ROUND_HALF_CEIL
   * 8: ROUND_HALF_FLOOR
   * @default 4
   */
  roundingMode?: RoundingMode;
}

export default class FixedPrecision {
  private value: bigint = 0n;
  private readonly ctx!: FPContext;

  private static makeContext(
    places: number,
    roundingMode: RoundingMode,
  ): FPContext {
    return makeContext(places, roundingMode);
  }

  private static defaultContext: FPContext = FixedPrecision.makeContext(8, 4);

  public static configure(config: FixedPrecisionConfig): void {
    FixedPrecision.defaultContext = configureContext(
      config,
      FixedPrecision.defaultContext,
    );
  }

  constructor(val: FixedPrecisionValue, ctx?: FPContext) {
    this.ctx = ctx ?? FixedPrecision.defaultContext;
    this.value = FixedPrecision.toScaled(val, this.ctx);
  }

  public static create(
    config: FixedPrecisionConfig,
  ): (val: FixedPrecisionValue) => FixedPrecision {
    const ctx = makeFactoryContext(config);
    return (val: FixedPrecisionValue) => new FixedPrecision(val, ctx);
  }

  public static isFixedPrecision(value: unknown): value is FixedPrecision {
    return value instanceof FixedPrecision;
  }

  public static sign(value: FixedPrecisionValue): number {
    if (value instanceof FixedPrecision) {
      return FixedPrecision.signRaw(value.value);
    }

    if (typeof value === "bigint") {
      return FixedPrecision.signRaw(value);
    }

    if (typeof value === "number") {
      return FixedPrecision.signNumber(value);
    }

    return FixedPrecision.signString(value);
  }

  protected fromRaw(rawValue: bigint): FixedPrecision {
    const instance = new FixedPrecision(0n, this.ctx);
    instance.value = rawValue;
    return instance;
  }

  private static fromRawWithContext(
    rawValue: bigint,
    ctx: FPContext,
  ): FixedPrecision {
    const instance = new FixedPrecision(0n, ctx);
    instance.value = rawValue;
    return instance;
  }

  private static fromDefaultContextValue(
    value: FixedPrecisionValue,
    operation: (value: bigint, ctx: FPContext) => bigint,
  ): FixedPrecision {
    const ctx = FixedPrecision.defaultContext;
    return FixedPrecision.fromRawWithContext(
      operation(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  private static signRaw(value: bigint): -1 | 0 | 1 {
    if (value > 0n) {
      return 1;
    }

    if (value < 0n) {
      return -1;
    }

    return 0;
  }

  private static signNumber(value: number): number {
    if (Number.isNaN(value)) {
      return NaN;
    }

    return value === 0 ? value : value < 0 ? -1 : 1;
  }

  private static signString(value: string): number {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return NaN;
    }

    if (numericValue === 0) {
      return value.trim().startsWith("-") ? -0 : 0;
    }

    try {
      return FixedPrecision.signRaw(
        FixedPrecision.toScaled(value, FixedPrecision.defaultContext),
      );
    } catch {
      return numericValue < 0 ? -1 : 1;
    }
  }

  private assertSameConfig(other: FixedPrecision) {
    if (this.ctx.places === other.ctx.places) return;
    if (this.ctx.places !== other.ctx.places) {
      throw new Error("Cannot operate on different precisions");
    }
  }

  private coerce(value: FixedPrecisionValue): FixedPrecision {
    if (value instanceof FixedPrecision) {
      this.assertSameConfig(value);
      return value;
    }

    return new FixedPrecision(value, this.ctx);
  }

  private static toScaled(value: FixedPrecisionValue, ctx: FPContext): bigint {
    if (value instanceof FixedPrecision) {
      return value.value;
    }
    if (typeof value === "bigint") {
      return value;
    }
    if (typeof value === "number") {
      return fromNumberWithCtx(value, ctx);
    }
    if (typeof value === "string") {
      return fromStringWithCtx(value, ctx);
    }
    throw new Error(`Invalid value type: ${typeof value}`);
  }

  private toScaledValue(value: FixedPrecisionValue): bigint {
    return FixedPrecision.toScaled(value, this.ctx);
  }

  public toNumber(): number {
    return toNumberWithCtx(this.value, this.ctx);
  }

  public toString(): string {
    return toStringWithCtx(this.value, this.ctx);
  }

  public abs(): FixedPrecision {
    return this.fromRaw(absolute(this.value));
  }

  public cmp(other: FixedPrecisionValue): Comparison {
    const o = this.coerce(other);
    return compareValues(this.value, o.value);
  }

  public eq(other: FixedPrecisionValue): boolean {
    const o = this.coerce(other);
    return equalsValue(this.value, o.value);
  }

  public gt(other: FixedPrecisionValue): boolean {
    const o = this.coerce(other);
    return greaterThanValue(this.value, o.value);
  }

  public gte(other: FixedPrecisionValue): boolean {
    const o = this.coerce(other);
    return greaterThanOrEqualValue(this.value, o.value);
  }

  public lt(other: FixedPrecisionValue): boolean {
    const o = this.coerce(other);
    return lessThanValue(this.value, o.value);
  }

  public lte(other: FixedPrecisionValue): boolean {
    const o = this.coerce(other);
    return lessThanOrEqualValue(this.value, o.value);
  }

  public cmpRaw(other: FixedPrecisionValue): Comparison {
    return compareValues(this.value, this.toScaledValue(other));
  }

  public eqRaw(other: FixedPrecisionValue): boolean {
    return equalsValue(this.value, this.toScaledValue(other));
  }

  public gtRaw(other: FixedPrecisionValue): boolean {
    return greaterThanValue(this.value, this.toScaledValue(other));
  }

  public gteRaw(other: FixedPrecisionValue): boolean {
    return greaterThanOrEqualValue(this.value, this.toScaledValue(other));
  }

  public ltRaw(other: FixedPrecisionValue): boolean {
    return lessThanValue(this.value, this.toScaledValue(other));
  }

  public lteRaw(other: FixedPrecisionValue): boolean {
    return lessThanOrEqualValue(this.value, this.toScaledValue(other));
  }

  public isZero(): boolean {
    return isZeroValue(this.value);
  }

  public isPositive(): boolean {
    return isPositiveValue(this.value);
  }

  public isNegative(): boolean {
    return isNegativeValue(this.value);
  }

  public isInteger(): boolean {
    return this.value % this.ctx.SCALE === 0n;
  }

  public places(): number {
    return this.ctx.places;
  }

  public decimalPlaces(): number {
    return this.places();
  }

  public precision(includeZeros = false): number {
    return significantDigitsValue(this.value, this.ctx, includeZeros);
  }

  public sd(includeZeros = false): number {
    return this.precision(includeZeros);
  }

  public add(other: FixedPrecisionValue): FixedPrecision {
    const o = this.coerce(other);
    return this.fromRaw(add(this.value, o.value));
  }

  public plus(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(add(this.value, this.toScaledValue(other)));
  }

  public sub(other: FixedPrecisionValue): FixedPrecision {
    const o = this.coerce(other);
    return this.fromRaw(subtract(this.value, o.value));
  }

  public minus(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(subtract(this.value, this.toScaledValue(other)));
  }

  public mul(other: FixedPrecisionValue): FixedPrecision {
    const o = this.coerce(other);
    return this.fromRaw(divide(multiply(this.value, o.value), this.ctx.SCALE));
  }

  public product(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(multiply(this.value, this.toScaledValue(other)));
  }

  public div(other: FixedPrecisionValue): FixedPrecision {
    const o = this.coerce(other);
    return this.fromRaw(divide(multiply(this.value, this.ctx.SCALE), o.value));
  }

  public fraction(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(divide(this.value, this.toScaledValue(other)));
  }

  public mod(other: FixedPrecisionValue): FixedPrecision {
    const o = this.coerce(other);
    return this.fromRaw(modulo(multiply(this.value, this.ctx.SCALE), o.value));
  }

  public leftover(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(modulo(this.value, this.toScaledValue(other)));
  }

  public bitAnd(other: FixedPrecisionValue): FixedPrecision {
    const o = this.coerce(other);
    return this.fromRaw(bitAnd(this.value, o.value));
  }

  public bitOr(other: FixedPrecisionValue): FixedPrecision {
    const o = this.coerce(other);
    return this.fromRaw(bitOr(this.value, o.value));
  }

  public bitXor(other: FixedPrecisionValue): FixedPrecision {
    const o = this.coerce(other);
    return this.fromRaw(bitXor(this.value, o.value));
  }

  public bitNot(): FixedPrecision {
    return this.fromRaw(bitNot(this.value));
  }

  public leftShift(n: number): FixedPrecision {
    if (!Number.isInteger(n) || n < 0) {
      throw new Error("Shift amount must be a non-negative integer");
    }
    return this.fromRaw(leftShift(this.value, n));
  }

  public rightArithShift(n: number): FixedPrecision {
    if (!Number.isInteger(n) || n < 0) {
      throw new Error("Shift amount must be a non-negative integer");
    }
    return this.fromRaw(rightArithShift(this.value, n));
  }

  public neg(): FixedPrecision {
    return this.fromRaw(negate(this.value));
  }

  public pow(exp: number): FixedPrecision {
    return this.fromRaw(power(this.value, exp, this.ctx.SCALE));
  }

  public square(): FixedPrecision {
    return this.fromRaw(power(this.value, 2, this.ctx.SCALE));
  }

  public cube(): FixedPrecision {
    return this.fromRaw(power(this.value, 3, this.ctx.SCALE));
  }

  public static PI(): FixedPrecision {
    return new FixedPrecision(piNumber());
  }

  public static e(): FixedPrecision {
    return new FixedPrecision(eNumber());
  }

  public static exp(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.defaultContext;
    const instance = new FixedPrecision(0n, ctx);
    instance.value = expValue(FixedPrecision.toScaled(value, ctx), ctx);
    return instance;
  }

  public static square(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, (rawValue, ctx) =>
      power(rawValue, 2, ctx.SCALE),
    );
  }

  public static cube(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, (rawValue, ctx) =>
      power(rawValue, 3, ctx.SCALE),
    );
  }

  public static sqrt(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, (rawValue, ctx) =>
      squareRoot(rawValue, ctx.SCALE),
    );
  }

  public static cbrt(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, (rawValue, ctx) =>
      cubeRoot(rawValue, ctx.SCALE),
    );
  }

  public static cubeRoot(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.cbrt(value);
  }

  public static sin(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, sinValue);
  }

  public static cos(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, cosValue);
  }

  public static tan(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, tanValue);
  }

  public static sec(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, secValue);
  }

  public static csc(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, cscValue);
  }

  public static cot(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, cotValue);
  }

  public static asin(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, asinValue);
  }

  public static acos(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, acosValue);
  }

  public static atan(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, atanValue);
  }

  public static atan2(
    y: FixedPrecisionValue,
    x: FixedPrecisionValue,
  ): FixedPrecision {
    const ctx = FixedPrecision.defaultContext;
    return FixedPrecision.fromRawWithContext(
      atan2Value(
        FixedPrecision.toScaled(y, ctx),
        FixedPrecision.toScaled(x, ctx),
        ctx,
      ),
      ctx,
    );
  }

  public static acot(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, acotValue);
  }

  public static asec(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, asecValue);
  }

  public static acsc(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, acscValue);
  }

  public static sinh(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, sinhValue);
  }

  public static cosh(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, coshValue);
  }

  public static tanh(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, tanhValue);
  }

  public static sech(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, sechValue);
  }

  public static csch(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, cschValue);
  }

  public static coth(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, cothValue);
  }

  public static asinh(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, asinhValue);
  }

  public static acosh(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, acoshValue);
  }

  public static atanh(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, atanhValue);
  }

  public static asech(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, asechValue);
  }

  public static acsch(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, acschValue);
  }

  public static acoth(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, acothValue);
  }

  public static phi(): FixedPrecision {
    return new FixedPrecision(phiNumber());
  }

  public static sqrt2(): FixedPrecision {
    return new FixedPrecision(sqrt2Number());
  }

  public sqrt(): FixedPrecision {
    return this.fromRaw(squareRoot(this.value, this.ctx.SCALE));
  }

  public cbrt(): FixedPrecision {
    return this.fromRaw(cubeRoot(this.value, this.ctx.SCALE));
  }

  public cubeRoot(): FixedPrecision {
    return this.cbrt();
  }

  public ln(): FixedPrecision {
    return this.fromRaw(naturalLogValue(this.value, this.ctx));
  }

  public log(base?: FixedPrecisionValue): FixedPrecision {
    if (base === undefined) {
      return this.ln();
    }
    const o = this.coerce(base);
    return this.fromRaw(logValue(this.value, o.value, this.ctx));
  }

  public log10(): FixedPrecision {
    return this.fromRaw(log10Value(this.value, this.ctx));
  }

  public log2(): FixedPrecision {
    return this.fromRaw(log2Value(this.value, this.ctx));
  }

  public exp(): FixedPrecision {
    return this.fromRaw(expValue(this.value, this.ctx));
  }

  public sin(): FixedPrecision {
    return this.fromRaw(sinValue(this.value, this.ctx));
  }

  public cos(): FixedPrecision {
    return this.fromRaw(cosValue(this.value, this.ctx));
  }

  public tan(): FixedPrecision {
    return this.fromRaw(tanValue(this.value, this.ctx));
  }

  public sec(): FixedPrecision {
    return this.fromRaw(secValue(this.value, this.ctx));
  }

  public csc(): FixedPrecision {
    return this.fromRaw(cscValue(this.value, this.ctx));
  }

  public cot(): FixedPrecision {
    return this.fromRaw(cotValue(this.value, this.ctx));
  }

  public asin(): FixedPrecision {
    return this.fromRaw(asinValue(this.value, this.ctx));
  }

  public acos(): FixedPrecision {
    return this.fromRaw(acosValue(this.value, this.ctx));
  }

  public atan(): FixedPrecision {
    return this.fromRaw(atanValue(this.value, this.ctx));
  }

  public atan2(x: FixedPrecisionValue): FixedPrecision {
    const o = this.coerce(x);
    return this.fromRaw(atan2Value(this.value, o.value, this.ctx));
  }

  public acot(): FixedPrecision {
    return this.fromRaw(acotValue(this.value, this.ctx));
  }

  public asec(): FixedPrecision {
    return this.fromRaw(asecValue(this.value, this.ctx));
  }

  public acsc(): FixedPrecision {
    return this.fromRaw(acscValue(this.value, this.ctx));
  }

  public sinh(): FixedPrecision {
    return this.fromRaw(sinhValue(this.value, this.ctx));
  }

  public cosh(): FixedPrecision {
    return this.fromRaw(coshValue(this.value, this.ctx));
  }

  public tanh(): FixedPrecision {
    return this.fromRaw(tanhValue(this.value, this.ctx));
  }

  public sech(): FixedPrecision {
    return this.fromRaw(sechValue(this.value, this.ctx));
  }

  public csch(): FixedPrecision {
    return this.fromRaw(cschValue(this.value, this.ctx));
  }

  public coth(): FixedPrecision {
    return this.fromRaw(cothValue(this.value, this.ctx));
  }

  public asinh(): FixedPrecision {
    return this.fromRaw(asinhValue(this.value, this.ctx));
  }

  public acosh(): FixedPrecision {
    return this.fromRaw(acoshValue(this.value, this.ctx));
  }

  public atanh(): FixedPrecision {
    return this.fromRaw(atanhValue(this.value, this.ctx));
  }

  public asech(): FixedPrecision {
    return this.fromRaw(asechValue(this.value, this.ctx));
  }

  public acsch(): FixedPrecision {
    return this.fromRaw(acschValue(this.value, this.ctx));
  }

  public acoth(): FixedPrecision {
    return this.fromRaw(acothValue(this.value, this.ctx));
  }

  public num(): FixedPrecision {
    const { numerator } = getNumeratorAndDenominator(
      this.value,
      this.ctx.SCALE,
    );
    return new FixedPrecision(numerator * this.ctx.SCALE, this.ctx);
  }

  public den(): FixedPrecision {
    const { denominator } = getNumeratorAndDenominator(
      this.value,
      this.ctx.SCALE,
    );
    return new FixedPrecision(denominator * this.ctx.SCALE, this.ctx);
  }

  public toJSON(): string {
    return this.toString();
  }

  public ceil(): FixedPrecision {
    return this.round(0, 2);
  }

  public floor(): FixedPrecision {
    return this.round(0, 3);
  }

  public trunc(): FixedPrecision {
    return this.round(0, 1);
  }

  public shiftedBy(n: number): FixedPrecision {
    return this.fromRaw(shiftedByValue(this.value, n));
  }

  public static random(decimalPlaces?: number): FixedPrecision {
    const dec = decimalPlaces ?? FixedPrecision.defaultContext.places;
    return new FixedPrecision(randomDecimalString(dec));
  }

  public static dot(
    a: FixedPrecisionValue[],
    b: FixedPrecisionValue[],
  ): FixedPrecision {
    const ctx = FixedPrecision.defaultContext;
    const rawA = a.map((v) => FixedPrecision.toScaled(v, ctx));
    const rawB = b.map((v) => FixedPrecision.toScaled(v, ctx));
    const result = dotProduct(rawA, rawB, ctx.SCALE);
    return new FixedPrecision(result, ctx);
  }

  public static cross(
    a: FixedPrecisionValue[],
    b: FixedPrecisionValue[],
  ): FixedPrecision[] {
    const ctx = FixedPrecision.defaultContext;
    const rawA = a.map((v) => FixedPrecision.toScaled(v, ctx));
    const rawB = b.map((v) => FixedPrecision.toScaled(v, ctx));
    const result = crossProduct(rawA, rawB, ctx.SCALE);
    return result.map((v) => new FixedPrecision(v, ctx));
  }

  private static normalized(v: FixedPrecisionValue): FixedPrecision {
    return v instanceof FixedPrecision
      ? new FixedPrecision(v.toString())
      : new FixedPrecision(v);
  }

  public static min(
    val: FixedPrecisionValue | FixedPrecisionValue[],
    ...vals: FixedPrecisionValue[]
  ): FixedPrecision {
    const values = collectValues(val, vals);
    return selectMin(
      values,
      (value) => FixedPrecision.normalized(value),
      (left, right) => left.lt(right),
    );
  }

  public static max(
    val: FixedPrecisionValue | FixedPrecisionValue[],
    ...vals: FixedPrecisionValue[]
  ): FixedPrecision {
    const values = collectValues(val, vals);
    return selectMax(
      values,
      (value) => FixedPrecision.normalized(value),
      (left, right) => left.gt(right),
    );
  }

  public static sum(
    val: FixedPrecisionValue | FixedPrecisionValue[],
    ...vals: FixedPrecisionValue[]
  ): FixedPrecision {
    const values = collectValues(val, vals);
    const firstValue = values[0];
    if (firstValue === undefined) {
      return new FixedPrecision(0n);
    }

    const first = FixedPrecision.normalized(firstValue);
    const total = sumRawValues(
      values.slice(1),
      first.value,
      (value) => FixedPrecision.normalized(value).value,
    );
    const instance = new FixedPrecision(0n, first.ctx);
    instance.value = total;
    return instance;
  }

  public static factorial(n: number | FixedPrecision): FixedPrecision {
    const ctx =
      n instanceof FixedPrecision ? n.ctx : FixedPrecision.defaultContext;
    const val =
      n instanceof FixedPrecision ? n.trunc().toNumber() : Math.trunc(n);
    return new FixedPrecision(factorialValue(val) * ctx.SCALE, ctx);
  }

  public static permutations(
    n: number | FixedPrecision,
    k: number | FixedPrecision,
  ): FixedPrecision {
    const ctx =
      n instanceof FixedPrecision ? n.ctx : FixedPrecision.defaultContext;
    const valN =
      n instanceof FixedPrecision ? n.trunc().toNumber() : Math.trunc(n);
    const valK =
      k instanceof FixedPrecision ? k.trunc().toNumber() : Math.trunc(k);
    return new FixedPrecision(permutationsValue(valN, valK) * ctx.SCALE, ctx);
  }

  public static combinations(
    n: number | FixedPrecision,
    k: number | FixedPrecision,
  ): FixedPrecision {
    const ctx =
      n instanceof FixedPrecision ? n.ctx : FixedPrecision.defaultContext;
    const valN =
      n instanceof FixedPrecision ? n.trunc().toNumber() : Math.trunc(n);
    const valK =
      k instanceof FixedPrecision ? k.trunc().toNumber() : Math.trunc(k);
    return new FixedPrecision(combinationsValue(valN, valK) * ctx.SCALE, ctx);
  }

  public round(
    dp: number = this.ctx.places,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    return this.fromRaw(roundValue(this.value, dp, rm, this.ctx));
  }

  public scale(
    newScale: number,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    const nextValue = scaleValue(this.value, newScale, rm, this.ctx);
    const nextCtx = FixedPrecision.makeContext(newScale, this.ctx.roundingMode);
    const instance = new FixedPrecision(0n, nextCtx);
    instance.value = nextValue;
    return instance;
  }

  public prec(
    sd: number,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    return this.fromRaw(precisionValue(this.value, sd, rm, this.ctx));
  }

  public toExponential(dp?: number, rm?: RoundingMode): string {
    const effDp = dp ?? this.ctx.places;
    const rounded = this.round(effDp, rm);
    const [int = "", frac = ""] = rounded.toString().split(".");
    const exp =
      int.length > 1
        ? int.length - 1
        : int === "0"
          ? -frac.search(/[1-9]/) - 1
          : 0;
    const shifted = rounded.div(
      new FixedPrecision(10n ** BigInt(Math.abs(exp)), this.ctx),
    );
    return `${shifted.toFixed(effDp)}e${exp}`;
  }

  public toPrecision(sd: number, rm?: RoundingMode): string {
    if (sd >= 1e6) {
      throw new Error("Invalid precision");
    }
    return this.round(sd - (Math.floor(Math.log10(this.toNumber())) + 1), rm)
      .toString()
      .replace(/0+$/, "");
  }

  public toFixed(places = 0, rm?: RoundingMode): string {
    return toFixedWithCtx(this.value, this.ctx, places, rm);
  }

  public toBinary(sd?: number, rm?: RoundingMode): string {
    return toBaseWithCtx(this.value, this.ctx, 2, sd, rm);
  }

  public toOctal(sd?: number, rm?: RoundingMode): string {
    return toBaseWithCtx(this.value, this.ctx, 8, sd, rm);
  }

  public toHex(sd?: number, rm?: RoundingMode): string {
    return toBaseWithCtx(this.value, this.ctx, 16, sd, rm);
  }

  public toHexadecimal(sd?: number, rm?: RoundingMode): string {
    return this.toHex(sd, rm);
  }

  public valueOf(): string {
    return this.toString();
  }

  public typeof(): "FixedPrecision" {
    return "FixedPrecision";
  }

  public raw(): bigint {
    return this.value;
  }
}

export const fixedconfig = {
  configure: FixedPrecision.configure.bind(FixedPrecision),
};
