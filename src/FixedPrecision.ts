import { abs } from "./abs";
import { acos } from "./acos";
import { acosh } from "./acosh";
import { acot } from "./acot";
import { acoth } from "./acoth";
import { acsc } from "./acsc";
import { acsch } from "./acsch";
import { add } from "./add";
import { precision_value } from "./arithmetic/precision";
import { scale_value } from "./arithmetic/scale";
import { asec } from "./asec";
import { asech } from "./asech";
import { asin } from "./asin";
import { asinh } from "./asinh";
import { atan } from "./atan";
import { atan2 } from "./atan2";
import { atanh } from "./atanh";
import { bitAnd } from "./bitAnd";
import { bitNot } from "./bitNot";
import { bitOr } from "./bitOr";
import { bitXor } from "./bitXor";
import { cbrt } from "./cbrt";
import { ceil } from "./ceil";
import { clamp } from "./clamp";
import { combinations } from "./combinations";
import { compare } from "./compare";
import { configureContext, FactoryContext, makeContext } from "./core/context";
import { cos } from "./cos";
import { cosh } from "./cosh";
import { cot } from "./cot";
import { coth } from "./coth";
import { cross } from "./cross";
import { csc } from "./csc";
import { csch } from "./csch";
import { cube } from "./cube";
import { divide } from "./divide";
import { divmod } from "./divmod";
import { dot } from "./dot";
import { e } from "./e";
import { equals } from "./equals";
import { exp } from "./exp";
import { factorial } from "./factorial";
import { floor } from "./floor";
import { fraction } from "./fraction";
import { getDenominator } from "./getDenominator";
import { getNumerator } from "./getNumerator";
import { greaterThan } from "./greaterThan";
import { greaterThanOrEqual } from "./greaterThanOrEqual";
import { hypot } from "./hypot";
import { idiv } from "./idiv";
import { idivmod } from "./idivmod";
import { isNegative } from "./isNegative";
import { isPositive } from "./isPositive";
import { isZero } from "./isZero";
import { leftShift } from "./leftShift";
import { lessThan } from "./lessThan";
import { lessThanOrEqual } from "./lessThanOrEqual";
import { log } from "./log";
import { log2 } from "./log2";
import { log10 } from "./log10";
import { logicalAnd } from "./logicalAnd";
import { logicalNot } from "./logicalNot";
import { logicalOr } from "./logicalOr";
import { logicalXor } from "./logicalXor";
import { max } from "./max";
import { min } from "./min";
import { mod } from "./mod";
import { multiply } from "./multiply";
import { naturalLog } from "./naturalLog";
import { neg } from "./neg";
import { from_number_with_ctx } from "./numeric";
import { permutations } from "./permutations";
import { phi } from "./phi";
import { pi } from "./pi";
import { pow } from "./pow";
import { precision } from "./precision";
import { random } from "./random";
import {
  compareValues,
  equalsValue,
  greaterThanOrEqualValue,
  greaterThanValue,
  lessThanOrEqualValue,
  lessThanValue,
} from "./relational";
import { rightArithShift } from "./rightArithShift";
import { round } from "./round";
import { scale } from "./scale";
import { sec } from "./sec";
import { sech } from "./sech";
import { shiftedBy } from "./shiftedBy";
import { sign } from "./sign";
import { sin } from "./sin";
import { sinh } from "./sinh";
import { sqrt } from "./sqrt";
import { sqrt2 } from "./sqrt2";
import { square } from "./square";
import { from_string_with_ctx } from "./string";
import { subtract } from "./subtract";
import { sum } from "./sum";
import { tan } from "./tan";
import { tanh } from "./tanh";
import { toBase } from "./toBase";
import { toExponential } from "./toExponential";
import { toFixed } from "./toFixed";
import { toNearest } from "./toNearest";
import { toNumber } from "./toNumber";
import { toPrecision } from "./toPrecision";
// biome-ignore lint/suspicious/noShadowRestrictedNames: nome da API pública
import { toString } from "./toString";
import { trunc } from "./trunc";

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

  private static defaultContext: FPContext = makeContext(8, 4);

  public static configure(config: FixedPrecisionConfig): void {
    FixedPrecision.defaultContext = configureContext(
      config,
      FixedPrecision.defaultContext,
    );
  }

  constructor(value: FixedPrecisionValue, ctx?: FPContext) {
    this.ctx = ctx ?? FixedPrecision.defaultContext;
    this.value = FixedPrecision.toScaled(value, this.ctx);
  }

  public static create(
    config: FixedPrecisionConfig,
  ): (val: FixedPrecisionValue) => FixedPrecision {
    const ctx = FactoryContext(config);
    return (val: FixedPrecisionValue) => new FixedPrecision(val, ctx);
  }

  public static isFixedPrecision(value: unknown): value is FixedPrecision {
    return value instanceof FixedPrecision;
  }

  protected fromRaw(rawValue: bigint): FixedPrecision {
    const instance = new FixedPrecision(0n, this.ctx);
    instance.value = rawValue;
    return instance;
  }

  public static fromRawWithContext(
    rawValue: bigint,
    ctx: FPContext,
  ): FixedPrecision {
    const instance = new FixedPrecision(0n, ctx);
    instance.value = rawValue;
    return instance;
  }

  private coerce(value: FixedPrecisionValue): FixedPrecision {
    if (value instanceof FixedPrecision) {
      if (
        this.ctx.places !== value.ctx.places ||
        this.ctx.roundingMode !== value.ctx.roundingMode
      ) {
        throw new Error("Cannot operate on different precisions");
      } else {
        return value;
      }
    } else {
      return new FixedPrecision(value, this.ctx);
    }
  }

  public static toScaled(value: FixedPrecisionValue, ctx: FPContext): bigint {
    if (value instanceof FixedPrecision) {
      if (value.ctx.places === ctx.places) return value.value;
      return scale_value(value.value, ctx.places, ctx.roundingMode, value.ctx);
    }
    if (typeof value === "bigint") return value;
    if (typeof value === "number") return from_number_with_ctx(value, ctx);
    if (typeof value === "string") return from_string_with_ctx(value, ctx);
    throw new Error(`Invalid value type: ${typeof value}`);
  }

  private toScaledValue(value: FixedPrecisionValue): bigint {
    return FixedPrecision.toScaled(value, this.ctx);
  }

  public toNumber(places?: number): number {
    return toNumber(this, places);
  }

  public toString(trimZeros = true): string {
    return toString(this, trimZeros);
  }

  public abs(): FixedPrecision {
    return abs(this);
  }

  public cmp(other: FixedPrecisionValue): Comparison {
    return compare(this, this.coerce(other));
  }

  public eq(other: FixedPrecisionValue): boolean {
    return equals(this, this.coerce(other));
  }

  public gt(other: FixedPrecisionValue): boolean {
    return greaterThan(this, this.coerce(other));
  }

  public gte(other: FixedPrecisionValue): boolean {
    return greaterThanOrEqual(this, this.coerce(other));
  }

  public lt(other: FixedPrecisionValue): boolean {
    return lessThan(this, this.coerce(other));
  }

  public lte(other: FixedPrecisionValue): boolean {
    return lessThanOrEqual(this, this.coerce(other));
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
    return isZero(this);
  }

  public isPositive(): boolean {
    return isPositive(this);
  }

  public isNegative(): boolean {
    return isNegative(this);
  }

  public not(): boolean {
    return logicalNot(this);
  }

  public and(other: FixedPrecisionValue): boolean {
    return logicalAnd(this, this.coerce(other));
  }

  public or(other: FixedPrecisionValue): boolean {
    return logicalOr(this, this.coerce(other));
  }

  public xor(other: FixedPrecisionValue): boolean {
    return logicalXor(this, this.coerce(other));
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
    return precision(this, includeZeros);
  }

  public sd(includeZeros = false): number {
    return this.precision(includeZeros);
  }

  public add(other: FixedPrecisionValue): FixedPrecision {
    return add(this, this.coerce(other));
  }

  public plus(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value + this.toScaledValue(other));
  }

  public sub(other: FixedPrecisionValue): FixedPrecision {
    return subtract(this, this.coerce(other));
  }

  public minus(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value - this.toScaledValue(other));
  }

  public mul(other: FixedPrecisionValue): FixedPrecision {
    return multiply(this, this.coerce(other));
  }

  public times(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value * this.toScaledValue(other));
  }

  public div(other: FixedPrecisionValue): FixedPrecision {
    return divide(this, this.coerce(other));
  }

  public ratio(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value / this.toScaledValue(other));
  }

  public mod(other: FixedPrecisionValue): FixedPrecision {
    return mod(this, this.coerce(other));
  }

  public rem(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value % this.toScaledValue(other));
  }

  public idiv(other: FixedPrecisionValue): FixedPrecision {
    return idiv(this, this.coerce(other));
  }

  public divmod(other: FixedPrecisionValue): {
    quotient: FixedPrecision;
    remainder: FixedPrecision;
  } {
    return divmod(this, this.coerce(other));
  }

  public idivmod(other: FixedPrecisionValue): {
    quotient: FixedPrecision;
    remainder: FixedPrecision;
  } {
    return idivmod(this, this.coerce(other));
  }

  public rest(other: FixedPrecisionValue): FixedPrecision {
    const d = this.divmod(other);
    return d.remainder;
  }

  public dividedToIntegerBy(other: FixedPrecisionValue): FixedPrecision {
    return this.idiv(other);
  }

  public clamp(
    min: FixedPrecisionValue,
    max: FixedPrecisionValue,
  ): FixedPrecision {
    return clamp(this, this.coerce(min), this.coerce(max));
  }

  public clampedTo(
    min: FixedPrecisionValue,
    max: FixedPrecisionValue,
  ): FixedPrecision {
    return this.clamp(min, max);
  }

  public toNearest(
    increment: FixedPrecisionValue,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    return toNearest(this, this.coerce(increment), rm);
  }

  public bitAnd(other: FixedPrecisionValue): FixedPrecision {
    return bitAnd(this, this.coerce(other));
  }

  public bitOr(other: FixedPrecisionValue): FixedPrecision {
    return bitOr(this, this.coerce(other));
  }

  public bitXor(other: FixedPrecisionValue): FixedPrecision {
    return bitXor(this, this.coerce(other));
  }

  public bitNot(): FixedPrecision {
    return bitNot(this);
  }

  public leftShift(n: number): FixedPrecision {
    return leftShift(this, n);
  }

  public rightArithShift(n: number): FixedPrecision {
    return rightArithShift(this, n);
  }

  public neg(): FixedPrecision {
    return neg(this);
  }

  public pow(exp: number): FixedPrecision {
    return pow(this, exp);
  }

  public square(): FixedPrecision {
    return square(this);
  }

  public cube(): FixedPrecision {
    return cube(this);
  }

  public sqrt(): FixedPrecision {
    return sqrt(this);
  }

  public cbrt(): FixedPrecision {
    return cbrt(this);
  }

  public cubeRoot(): FixedPrecision {
    return this.cbrt();
  }

  public ln(): FixedPrecision {
    return naturalLog(this);
  }

  public log(base?: FixedPrecisionValue): FixedPrecision {
    return log(this, base === undefined ? undefined : this.coerce(base));
  }

  public log10(): FixedPrecision {
    return log10(this);
  }

  public log2(): FixedPrecision {
    return log2(this);
  }

  public exp(): FixedPrecision {
    return exp(this);
  }

  public sin(): FixedPrecision {
    return sin(this);
  }

  public cos(): FixedPrecision {
    return cos(this);
  }

  public tan(): FixedPrecision {
    return tan(this);
  }

  public sec(): FixedPrecision {
    return sec(this);
  }

  public csc(): FixedPrecision {
    return csc(this);
  }

  public cot(): FixedPrecision {
    return cot(this);
  }

  public asin(): FixedPrecision {
    return asin(this);
  }

  public acos(): FixedPrecision {
    return acos(this);
  }

  public atan(): FixedPrecision {
    return atan(this);
  }

  public atan2(x: FixedPrecisionValue): FixedPrecision {
    return atan2(this, this.coerce(x));
  }

  public acot(): FixedPrecision {
    return acot(this);
  }

  public asec(): FixedPrecision {
    return asec(this);
  }

  public acsc(): FixedPrecision {
    return acsc(this);
  }

  public sinh(): FixedPrecision {
    return sinh(this);
  }

  public cosh(): FixedPrecision {
    return cosh(this);
  }

  public tanh(): FixedPrecision {
    return tanh(this);
  }

  public sech(): FixedPrecision {
    return sech(this);
  }

  public csch(): FixedPrecision {
    return csch(this);
  }

  public coth(): FixedPrecision {
    return coth(this);
  }

  public asinh(): FixedPrecision {
    return asinh(this);
  }

  public acosh(): FixedPrecision {
    return acosh(this);
  }

  public atanh(): FixedPrecision {
    return atanh(this);
  }

  public asech(): FixedPrecision {
    return asech(this);
  }

  public acsch(): FixedPrecision {
    return acsch(this);
  }

  public acoth(): FixedPrecision {
    return acoth(this);
  }

  public num(): FixedPrecision {
    return getNumerator(this);
  }

  public den(): FixedPrecision {
    return getDenominator(this);
  }

  public fraction(
    maxDen?: FixedPrecisionValue,
  ): [FixedPrecision, FixedPrecision] {
    return fraction(
      this,
      maxDen === undefined ? undefined : this.coerce(maxDen),
    );
  }

  public round(
    dp: number = this.ctx.places,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    return round(this, dp, rm);
  }

  public scale(
    newScale: number,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    return scale(this, newScale, rm);
  }

  public prec(
    sd: number,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    return this.fromRaw(precision_value(this.value, sd, rm, this.ctx));
  }

  public toJSON(): string {
    return this.toString();
  }

  public ceil(): FixedPrecision {
    return ceil(this);
  }

  public floor(): FixedPrecision {
    return floor(this);
  }

  public trunc(): FixedPrecision {
    return trunc(this);
  }

  public shiftedBy(n: number): FixedPrecision {
    return shiftedBy(this, n);
  }

  public static sign(value: FixedPrecisionValue): number {
    return sign(value);
  }

  public static not(value: FixedPrecisionValue): boolean {
    return logicalNot(value);
  }

  public static and(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): boolean {
    return logicalAnd(left, right);
  }

  public static or(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): boolean {
    return logicalOr(left, right);
  }

  public static xor(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): boolean {
    return logicalXor(left, right);
  }

  public static fromContextValue(
    value: FixedPrecisionValue,
    operation: (value: bigint, ctx: FPContext) => bigint,
  ): FixedPrecision {
    const ctx =
      value instanceof FixedPrecision
        ? value.ctx
        : FixedPrecision.defaultContext;
    return FixedPrecision.fromRawWithContext(
      operation(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static PI(): FixedPrecision {
    return pi();
  }

  public static e(): FixedPrecision {
    return e();
  }

  public static exp(value: FixedPrecisionValue): FixedPrecision {
    return exp(value);
  }

  public static abs(value: FixedPrecisionValue): FixedPrecision {
    return abs(value);
  }

  public static add(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    return add(left, right);
  }

  public static sub(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    return subtract(left, right);
  }

  public static mul(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    return multiply(left, right);
  }

  public static div(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    return divide(left, right);
  }

  public static mod(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    return mod(left, right);
  }

  public static pow(value: FixedPrecisionValue, exp: number): FixedPrecision {
    return pow(value, exp);
  }

  public static ceil(value: FixedPrecisionValue): FixedPrecision {
    return ceil(value);
  }

  public static floor(value: FixedPrecisionValue): FixedPrecision {
    return floor(value);
  }

  public static trunc(value: FixedPrecisionValue): FixedPrecision {
    return trunc(value);
  }

  public static round(
    value: FixedPrecisionValue,
    dp?: number,
    rm?: RoundingMode,
  ): FixedPrecision {
    return round(value, dp, rm);
  }

  public static ln(value: FixedPrecisionValue): FixedPrecision {
    return naturalLog(value);
  }

  public static log(
    value: FixedPrecisionValue,
    base?: FixedPrecisionValue,
  ): FixedPrecision {
    return log(value, base);
  }

  public static log2(value: FixedPrecisionValue): FixedPrecision {
    return log2(value);
  }

  public static log10(value: FixedPrecisionValue): FixedPrecision {
    return log10(value);
  }

  public static clamp(
    value: FixedPrecisionValue,
    min: FixedPrecisionValue,
    max: FixedPrecisionValue,
  ): FixedPrecision {
    return clamp(value, min, max);
  }

  public static square(value: FixedPrecisionValue): FixedPrecision {
    return square(value);
  }

  public static cube(value: FixedPrecisionValue): FixedPrecision {
    return cube(value);
  }

  public static sqrt(value: FixedPrecisionValue): FixedPrecision {
    return sqrt(value);
  }

  public static cbrt(value: FixedPrecisionValue): FixedPrecision {
    return cbrt(value);
  }

  public static sin(value: FixedPrecisionValue): FixedPrecision {
    return sin(value);
  }

  public static cos(value: FixedPrecisionValue): FixedPrecision {
    return cos(value);
  }

  public static tan(value: FixedPrecisionValue): FixedPrecision {
    return tan(value);
  }

  public static sec(value: FixedPrecisionValue): FixedPrecision {
    return sec(value);
  }

  public static csc(value: FixedPrecisionValue): FixedPrecision {
    return csc(value);
  }

  public static cot(value: FixedPrecisionValue): FixedPrecision {
    return cot(value);
  }

  public static asin(value: FixedPrecisionValue): FixedPrecision {
    return asin(value);
  }

  public static acos(value: FixedPrecisionValue): FixedPrecision {
    return acos(value);
  }

  public static atan(value: FixedPrecisionValue): FixedPrecision {
    return atan(value);
  }

  public static atan2(
    y: FixedPrecisionValue,
    x: FixedPrecisionValue,
  ): FixedPrecision {
    return atan2(y, x);
  }

  public static acot(value: FixedPrecisionValue): FixedPrecision {
    return acot(value);
  }

  public static asec(value: FixedPrecisionValue): FixedPrecision {
    return asec(value);
  }

  public static acsc(value: FixedPrecisionValue): FixedPrecision {
    return acsc(value);
  }

  public static sinh(value: FixedPrecisionValue): FixedPrecision {
    return sinh(value);
  }

  public static cosh(value: FixedPrecisionValue): FixedPrecision {
    return cosh(value);
  }

  public static tanh(value: FixedPrecisionValue): FixedPrecision {
    return tanh(value);
  }

  public static sech(value: FixedPrecisionValue): FixedPrecision {
    return sech(value);
  }

  public static csch(value: FixedPrecisionValue): FixedPrecision {
    return csch(value);
  }

  public static coth(value: FixedPrecisionValue): FixedPrecision {
    return coth(value);
  }

  public static asinh(value: FixedPrecisionValue): FixedPrecision {
    return asinh(value);
  }

  public static acosh(value: FixedPrecisionValue): FixedPrecision {
    return acosh(value);
  }

  public static atanh(value: FixedPrecisionValue): FixedPrecision {
    return atanh(value);
  }

  public static asech(value: FixedPrecisionValue): FixedPrecision {
    return asech(value);
  }

  public static acsch(value: FixedPrecisionValue): FixedPrecision {
    return acsch(value);
  }

  public static acoth(value: FixedPrecisionValue): FixedPrecision {
    return acoth(value);
  }

  public static phi(): FixedPrecision {
    return phi();
  }

  public static sqrt2(): FixedPrecision {
    return sqrt2();
  }

  public static random(decimalPlaces?: number): FixedPrecision {
    return random(decimalPlaces);
  }

  public static resolveContext(values: FixedPrecisionValue[]): FPContext {
    let best: FPContext | null = null;
    for (const v of values) {
      if (v instanceof FixedPrecision) {
        if (!best || v.ctx.places > best.places) {
          best = v.ctx;
          if (best.places === 20) return best;
        }
      }
    }
    return best ?? FixedPrecision.defaultContext;
  }

  public static normalizeTo(
    v: FixedPrecisionValue,
    ctx: FPContext,
  ): FixedPrecision {
    if (v instanceof FixedPrecision) {
      if (
        v.ctx.places === ctx.places &&
        v.ctx.roundingMode === ctx.roundingMode
      ) {
        return v;
      }
      return v.scale(ctx.places, ctx.roundingMode);
    } else {
      return new FixedPrecision(v, ctx);
    }
  }

  public static dot(
    a: FixedPrecisionValue[],
    b: FixedPrecisionValue[],
  ): FixedPrecision {
    return dot(a, b);
  }

  public static cross(
    a: FixedPrecisionValue[],
    b: FixedPrecisionValue[],
  ): FixedPrecision[] {
    return cross(a, b);
  }

  public static min(
    val: FixedPrecisionValue | FixedPrecisionValue[],
    ...vals: FixedPrecisionValue[]
  ): FixedPrecision {
    return min(val, ...vals);
  }

  public static max(
    val: FixedPrecisionValue | FixedPrecisionValue[],
    ...vals: FixedPrecisionValue[]
  ): FixedPrecision {
    return max(val, ...vals);
  }

  public static sum(
    val: FixedPrecisionValue | FixedPrecisionValue[],
    ...vals: FixedPrecisionValue[]
  ): FixedPrecision {
    return sum(val, ...vals);
  }

  public static hypot(
    val?: FixedPrecisionValue | FixedPrecisionValue[],
    ...vals: FixedPrecisionValue[]
  ): FixedPrecision {
    return hypot(val, ...vals);
  }

  public static factorial(n: number | FixedPrecision): FixedPrecision {
    return factorial(n);
  }

  public static permutations(
    n: number | FixedPrecision,
    k: number | FixedPrecision,
  ): FixedPrecision {
    return permutations(n, k);
  }

  public static combinations(
    n: number | FixedPrecision,
    k: number | FixedPrecision,
  ): FixedPrecision {
    return combinations(n, k);
  }

  public toExponential(dp?: number, rm?: RoundingMode): string {
    return toExponential(this, dp, rm);
  }

  public toPrecision(sd: number, rm?: RoundingMode): string {
    return toPrecision(this, sd, rm);
  }

  public toFixed(places = 0, rm?: RoundingMode): string {
    return toFixed(this, places, rm);
  }

  public toBinary(sd?: number, rm?: RoundingMode): string {
    return toBase(this, 2, sd, rm);
  }

  public toOctal(sd?: number, rm?: RoundingMode): string {
    return toBase(this, 8, sd, rm);
  }

  public toHex(sd?: number, rm?: RoundingMode): string {
    return toBase(this, 16, sd, rm);
  }

  public toHexadecimal(sd?: number, rm?: RoundingMode): string {
    return this.toHex(sd, rm);
  }

  public toBase(base: 2 | 8 | 16, sd?: number, rm?: RoundingMode): string {
    return toBase(this, base, sd, rm);
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
