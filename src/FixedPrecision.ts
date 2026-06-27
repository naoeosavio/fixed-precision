import {
  cbrt_value,
  exp_value,
  log_value,
  log2_value,
  log10_value,
  natural_log_value,
  power,
  precision_value,
  round_to_scale_value,
  round_value,
  scale_value,
  shifted_by_value,
  significant_digits_value,
  sqrt_value,
} from "./arithmetic";
import {
  combinations_value,
  factorial_value,
  permutations_value,
} from "./combinatorics";
import { collectValues } from "./construction/values";
import { configureContext, FactoryContext, makeContext } from "./core/context";
import { get_denominator, get_numerator, fraction_value } from "./fraction";
import {
  isNegativeValue,
  isPositiveValue,
  isZeroValue,
  logicalAndValues,
  logicalNotValue,
  logicalOrValues,
  logicalXorValues,
} from "./logical";
import { cross_product, dot_product } from "./matrix";
import { from_number_with_ctx, to_number_with_ctx } from "./numeric";
import {
  compareValues,
  equalsValue,
  greaterThanOrEqualValue,
  greaterThanValue,
  lessThanOrEqualValue,
  lessThanValue,
} from "./relational";
import { max_values, min_values, sum_values } from "./statistics";
import {
  from_string_with_ctx,
  to_base_with_ctx,
  to_string_with_ctx,
} from "./string";
import {
  acos_value,
  acosh_value,
  acot_value,
  acoth_value,
  acsc_value,
  acsch_value,
  asec_value,
  asech_value,
  asin_value,
  asinh_value,
  atan_value,
  atan2_value,
  atanh_value,
  cos_value,
  cosh_value,
  cot_value,
  coth_value,
  csc_value,
  csch_value,
  sec_value,
  sech_value,
  sin_value,
  sinh_value,
  tan_value,
  tanh_value,
} from "./trigonometry";

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

  private static fromRawWithContext(
    rawValue: bigint,
    ctx: FPContext,
  ): FixedPrecision {
    const instance = new FixedPrecision(0n, ctx);
    instance.value = rawValue;
    return instance;
  }

  private coerce(value: FixedPrecisionValue): FixedPrecision {
    if (value instanceof FixedPrecision) {
      if (this.ctx.places !== value.ctx.places) {
        throw new Error("Cannot operate on different precisions");
      } else {
        return value;
      }
    } else {
      return new FixedPrecision(value, this.ctx);
    }
  }

  private static toScaled(value: FixedPrecisionValue, ctx: FPContext): bigint {
    if (value instanceof FixedPrecision) return value.value;
    if (typeof value === "bigint") return value;
    if (typeof value === "number") return from_number_with_ctx(value, ctx);
    if (typeof value === "string") return from_string_with_ctx(value, ctx);
    throw new Error(`Invalid value type: ${typeof value}`);
  }

  private toScaledValue(value: FixedPrecisionValue): bigint {
    return FixedPrecision.toScaled(value, this.ctx);
  }

  public toNumber(places?: number): number {
    if (places === undefined) {
      return to_number_with_ctx(this.value, this.ctx);
    }

    const scaled = this.scale(places);
    return to_number_with_ctx(scaled.value, scaled.ctx);
  }

  public toString(): string {
    return to_string_with_ctx(this.value, this.ctx);
  }

  public abs(): FixedPrecision {
    return this.fromRaw(this.value < 0n ? -this.value : this.value);
  }

  public cmp(other: FixedPrecisionValue): Comparison {
    return compareValues(this.value, this.coerce(other).value);
  }

  public eq(other: FixedPrecisionValue): boolean {
    return equalsValue(this.value, this.coerce(other).value);
  }

  public gt(other: FixedPrecisionValue): boolean {
    return greaterThanValue(this.value, this.coerce(other).value);
  }

  public gte(other: FixedPrecisionValue): boolean {
    return greaterThanOrEqualValue(this.value, this.coerce(other).value);
  }

  public lt(other: FixedPrecisionValue): boolean {
    return lessThanValue(this.value, this.coerce(other).value);
  }

  public lte(other: FixedPrecisionValue): boolean {
    return lessThanOrEqualValue(this.value, this.coerce(other).value);
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

  public not(): boolean {
    return logicalNotValue(this.value);
  }

  public and(other: FixedPrecisionValue): boolean {
    return logicalAndValues(this.value, this.coerce(other).value);
  }

  public or(other: FixedPrecisionValue): boolean {
    return logicalOrValues(this.value, this.coerce(other).value);
  }

  public xor(other: FixedPrecisionValue): boolean {
    return logicalXorValues(this.value, this.coerce(other).value);
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
    return significant_digits_value(this.value, this.ctx, includeZeros);
  }

  public sd(includeZeros = false): number {
    return this.precision(includeZeros);
  }

  public add(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value + this.coerce(other).value);
  }

  public plus(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value - this.toScaledValue(other));
  }

  public sub(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value - this.coerce(other).value);
  }

  public minus(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value - this.toScaledValue(other));
  }

  public mul(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(
      (this.value * this.coerce(other).value) / this.ctx.SCALE,
    );
  }

  public times(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value * this.toScaledValue(other));
  }

  public div(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(
      (this.value * this.ctx.SCALE) / this.coerce(other).value,
    );
  }

  public ratio(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value / this.toScaledValue(other));
  }

  public mod(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(
      (this.value * this.ctx.SCALE) % this.coerce(other).value,
    );
  }

  public rem(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value % this.toScaledValue(other));
  }

  public idiv(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(
      (this.value / this.coerce(other).value) * this.ctx.SCALE,
    );
  }

  public divmod(other: FixedPrecisionValue): {
    quotient: FixedPrecision;
    remainder: FixedPrecision;
  } {
    const coerced = this.coerce(other);
    const scaled = this.value * this.ctx.SCALE;
    return {
      quotient: this.fromRaw(scaled / coerced.value),
      remainder: this.fromRaw(scaled % coerced.value),
    };
  }

  public dividedToIntegerBy(other: FixedPrecisionValue): FixedPrecision {
    return this.idiv(other);
  }

  public clamp(
    min: FixedPrecisionValue,
    max: FixedPrecisionValue,
  ): FixedPrecision {
    const lower = this.coerce(min);
    const upper = this.coerce(max);

    if (greaterThanValue(lower.value, upper.value)) {
      throw new Error("min must be less than or equal to max");
    }

    if (lessThanValue(this.value, lower.value)) {
      return this.fromRaw(lower.value);
    }

    if (greaterThanValue(this.value, upper.value)) {
      return this.fromRaw(upper.value);
    }

    return this.fromRaw(this.value);
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
    const step = this.coerce(increment).abs().value;
    if (step === 0n) {
      throw new Error("Increment must be non-zero");
    }

    return this.fromRaw(round_to_scale_value(this.value, step, rm) * step);
  }

  public bitAnd(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value & this.coerce(other).value);
  }

  public bitOr(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value | this.coerce(other).value);
  }

  public bitXor(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value ^ this.coerce(other).value);
  }

  public bitNot(): FixedPrecision {
    return this.fromRaw(~this.value);
  }

  public leftShift(n: number): FixedPrecision {
    if (!Number.isInteger(n) || n < 0) {
      throw new Error("Shift amount must be a non-negative integer");
    }
    return this.fromRaw(this.value << BigInt(n));
  }

  public rightArithShift(n: number): FixedPrecision {
    if (!Number.isInteger(n) || n < 0) {
      throw new Error("Shift amount must be a non-negative integer");
    }
    return this.fromRaw(this.value >> BigInt(n));
  }

  public neg(): FixedPrecision {
    return this.fromRaw(-this.value);
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

  public sqrt(): FixedPrecision {
    return this.fromRaw(sqrt_value(this.value, this.ctx.SCALE));
  }

  public cbrt(): FixedPrecision {
    return this.fromRaw(cbrt_value(this.value, this.ctx.SCALE));
  }

  public cubeRoot(): FixedPrecision {
    return this.cbrt();
  }

  public ln(): FixedPrecision {
    return this.fromRaw(natural_log_value(this.value, this.ctx));
  }

  public log(base?: FixedPrecisionValue): FixedPrecision {
    if (base === undefined) {
      return this.ln();
    }
    return this.fromRaw(
      log_value(this.value, this.coerce(base).value, this.ctx),
    );
  }

  public log10(): FixedPrecision {
    return this.fromRaw(log10_value(this.value, this.ctx));
  }

  public log2(): FixedPrecision {
    return this.fromRaw(log2_value(this.value, this.ctx));
  }

  public exp(): FixedPrecision {
    return this.fromRaw(exp_value(this.value, this.ctx));
  }

  public sin(): FixedPrecision {
    return this.fromRaw(sin_value(this.value, this.ctx));
  }

  public cos(): FixedPrecision {
    return this.fromRaw(cos_value(this.value, this.ctx));
  }

  public tan(): FixedPrecision {
    return this.fromRaw(tan_value(this.value, this.ctx));
  }

  public sec(): FixedPrecision {
    return this.fromRaw(sec_value(this.value, this.ctx));
  }

  public csc(): FixedPrecision {
    return this.fromRaw(csc_value(this.value, this.ctx));
  }

  public cot(): FixedPrecision {
    return this.fromRaw(cot_value(this.value, this.ctx));
  }

  public asin(): FixedPrecision {
    return this.fromRaw(asin_value(this.value, this.ctx));
  }

  public acos(): FixedPrecision {
    return this.fromRaw(acos_value(this.value, this.ctx));
  }

  public atan(): FixedPrecision {
    return this.fromRaw(atan_value(this.value, this.ctx));
  }

  public atan2(x: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(
      atan2_value(this.value, this.coerce(x).value, this.ctx),
    );
  }

  public acot(): FixedPrecision {
    return this.fromRaw(acot_value(this.value, this.ctx));
  }

  public asec(): FixedPrecision {
    return this.fromRaw(asec_value(this.value, this.ctx));
  }

  public acsc(): FixedPrecision {
    return this.fromRaw(acsc_value(this.value, this.ctx));
  }

  public sinh(): FixedPrecision {
    return this.fromRaw(sinh_value(this.value, this.ctx));
  }

  public cosh(): FixedPrecision {
    return this.fromRaw(cosh_value(this.value, this.ctx));
  }

  public tanh(): FixedPrecision {
    return this.fromRaw(tanh_value(this.value, this.ctx));
  }

  public sech(): FixedPrecision {
    return this.fromRaw(sech_value(this.value, this.ctx));
  }

  public csch(): FixedPrecision {
    return this.fromRaw(csch_value(this.value, this.ctx));
  }

  public coth(): FixedPrecision {
    return this.fromRaw(coth_value(this.value, this.ctx));
  }

  public asinh(): FixedPrecision {
    return this.fromRaw(asinh_value(this.value, this.ctx));
  }

  public acosh(): FixedPrecision {
    return this.fromRaw(acosh_value(this.value, this.ctx));
  }

  public atanh(): FixedPrecision {
    return this.fromRaw(atanh_value(this.value, this.ctx));
  }

  public asech(): FixedPrecision {
    return this.fromRaw(asech_value(this.value, this.ctx));
  }

  public acsch(): FixedPrecision {
    return this.fromRaw(acsch_value(this.value, this.ctx));
  }

  public acoth(): FixedPrecision {
    return this.fromRaw(acoth_value(this.value, this.ctx));
  }

  public num(): FixedPrecision {
    const numerator = get_numerator(this.value, this.ctx.SCALE);
    return new FixedPrecision(numerator * this.ctx.SCALE, this.ctx);
  }

  public den(): FixedPrecision {
    const denominator = get_denominator(this.value, this.ctx.SCALE);
    return new FixedPrecision(denominator * this.ctx.SCALE, this.ctx);
  }

  public fraction(
    maxDen?: FixedPrecisionValue,
  ): [FixedPrecision, FixedPrecision] {
    const fraction =
      maxDen === undefined
        ? fraction_value(this.value, this.ctx.SCALE)
        : fraction_value(
            this.value,
            this.ctx.SCALE,
            FixedPrecision.normalized(maxDen).scale(0, 1).value,
          );

    return [
      this.fromRaw(fraction.numerator * this.ctx.SCALE),
      this.fromRaw(fraction.denominator * this.ctx.SCALE),
    ];
  }

  public round(
    dp: number = this.ctx.places,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    return this.fromRaw(round_value(this.value, dp, rm, this.ctx));
  }

  public scale(
    newScale: number,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    const nextValue = scale_value(this.value, newScale, rm, this.ctx);
    const nextCtx = FixedPrecision.makeContext(newScale, this.ctx.roundingMode);
    const instance = new FixedPrecision(0n, nextCtx);
    instance.value = nextValue;
    return instance;
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
    return this.round(0, 2);
  }

  public floor(): FixedPrecision {
    return this.round(0, 3);
  }

  public trunc(): FixedPrecision {
    return this.round(0, 1);
  }

  public shiftedBy(n: number): FixedPrecision {
    return this.fromRaw(shifted_by_value(this.value, n));
  }

  public static sign(value: FixedPrecisionValue): number {
    if (value instanceof FixedPrecision) {
      return compareValues(value.value, 0n);
    }

    if (typeof value === "bigint") {
      return compareValues(value, 0n);
    }

    if (typeof value === "number") {
      return FixedPrecision.signNumber(value);
    }

    return FixedPrecision.signString(value);
  }

  public static not(value: FixedPrecisionValue): boolean {
    return logicalNotValue(FixedPrecision.normalized(value).value);
  }

  public static and(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): boolean {
    return logicalAndValues(
      FixedPrecision.normalized(left).value,
      FixedPrecision.normalized(right).value,
    );
  }

  public static or(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): boolean {
    return logicalOrValues(
      FixedPrecision.normalized(left).value,
      FixedPrecision.normalized(right).value,
    );
  }

  public static xor(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): boolean {
    return logicalXorValues(
      FixedPrecision.normalized(left).value,
      FixedPrecision.normalized(right).value,
    );
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
      return compareValues(
        FixedPrecision.toScaled(value, FixedPrecision.defaultContext),
        0n,
      );
    } catch {
      return numericValue < 0 ? -1 : 1;
    }
  }

  public static PI(): FixedPrecision {
    return new FixedPrecision(Math.PI);
  }

  public static e(): FixedPrecision {
    return new FixedPrecision(Math.E);
  }

  public static exp(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.defaultContext;
    const instance = new FixedPrecision(0n, ctx);
    instance.value = exp_value(FixedPrecision.toScaled(value, ctx), ctx);
    return instance;
  }

  public static abs(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.normalized(value).abs();
  }

  public static add(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    return FixedPrecision.normalized(left).add(
      FixedPrecision.normalized(right),
    );
  }

  public static sub(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    return FixedPrecision.normalized(left).sub(
      FixedPrecision.normalized(right),
    );
  }

  public static mul(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    return FixedPrecision.normalized(left).mul(
      FixedPrecision.normalized(right),
    );
  }

  public static div(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    return FixedPrecision.normalized(left).div(
      FixedPrecision.normalized(right),
    );
  }

  public static mod(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    return FixedPrecision.normalized(left).mod(
      FixedPrecision.normalized(right),
    );
  }

  public static pow(value: FixedPrecisionValue, exp: number): FixedPrecision {
    return FixedPrecision.normalized(value).pow(exp);
  }

  public static ceil(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.normalized(value).ceil();
  }

  public static floor(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.normalized(value).floor();
  }

  public static trunc(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.normalized(value).trunc();
  }

  public static round(
    value: FixedPrecisionValue,
    dp?: number,
    rm?: RoundingMode,
  ): FixedPrecision {
    return FixedPrecision.normalized(value).round(dp, rm);
  }

  public static ln(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.normalized(value).ln();
  }

  public static log(
    value: FixedPrecisionValue,
    base?: FixedPrecisionValue,
  ): FixedPrecision {
    const normalizedValue = FixedPrecision.normalized(value);
    return base === undefined
      ? normalizedValue.log()
      : normalizedValue.log(FixedPrecision.normalized(base));
  }

  public static log2(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.normalized(value).log2();
  }

  public static log10(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.normalized(value).log10();
  }

  public static clamp(
    value: FixedPrecisionValue,
    min: FixedPrecisionValue,
    max: FixedPrecisionValue,
  ): FixedPrecision {
    return FixedPrecision.normalized(value).clamp(
      FixedPrecision.normalized(min),
      FixedPrecision.normalized(max),
    );
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
      sqrt_value(rawValue, ctx.SCALE),
    );
  }

  public static cbrt(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, (rawValue, ctx) =>
      cbrt_value(rawValue, ctx.SCALE),
    );
  }

  public static cubeRoot(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.cbrt(value);
  }

  public static sin(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, sin_value);
  }

  public static cos(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, cos_value);
  }

  public static tan(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, tan_value);
  }

  public static sec(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, sec_value);
  }

  public static csc(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, csc_value);
  }

  public static cot(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, cot_value);
  }

  public static asin(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, asin_value);
  }

  public static acos(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, acos_value);
  }

  public static atan(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, atan_value);
  }

  public static atan2(
    y: FixedPrecisionValue,
    x: FixedPrecisionValue,
  ): FixedPrecision {
    const ctx = FixedPrecision.defaultContext;
    return FixedPrecision.fromRawWithContext(
      atan2_value(
        FixedPrecision.toScaled(y, ctx),
        FixedPrecision.toScaled(x, ctx),
        ctx,
      ),
      ctx,
    );
  }

  public static acot(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, acot_value);
  }

  public static asec(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, asec_value);
  }

  public static acsc(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, acsc_value);
  }

  public static sinh(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, sinh_value);
  }

  public static cosh(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, cosh_value);
  }

  public static tanh(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, tanh_value);
  }

  public static sech(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, sech_value);
  }

  public static csch(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, csch_value);
  }

  public static coth(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, coth_value);
  }

  public static asinh(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, asinh_value);
  }

  public static acosh(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, acosh_value);
  }

  public static atanh(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, atanh_value);
  }

  public static asech(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, asech_value);
  }

  public static acsch(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, acsch_value);
  }

  public static acoth(value: FixedPrecisionValue): FixedPrecision {
    return FixedPrecision.fromDefaultContextValue(value, acoth_value);
  }

  public static phi(): FixedPrecision {
    return new FixedPrecision((1 + Math.sqrt(5)) / 2);
  }

  public static sqrt2(): FixedPrecision {
    return new FixedPrecision(Math.sqrt(2));
  }

  public static random(decimalPlaces?: number): FixedPrecision {
    const dec = decimalPlaces ?? FixedPrecision.defaultContext.places;
    const rand = BigInt(Math.floor(Math.random() * 10 ** dec));

    if (decimalPlaces === undefined) {
      return new FixedPrecision(rand);
    }

    const defaultPlaces = FixedPrecision.defaultContext.places;
    const diff = defaultPlaces - dec;
    return new FixedPrecision(
      diff >= 0 ? rand * 10n ** BigInt(diff) : rand / 10n ** BigInt(-diff),
    );
  }

  public static dot(
    a: FixedPrecisionValue[],
    b: FixedPrecisionValue[],
  ): FixedPrecision {
    const ctx = FixedPrecision.defaultContext;
    const rawA = a.map((v) => FixedPrecision.toScaled(v, ctx));
    const rawB = b.map((v) => FixedPrecision.toScaled(v, ctx));
    const result = dot_product(rawA, rawB, ctx.SCALE);
    return new FixedPrecision(result, ctx);
  }

  public static cross(
    a: FixedPrecisionValue[],
    b: FixedPrecisionValue[],
  ): FixedPrecision[] {
    const ctx = FixedPrecision.defaultContext;
    const rawA = a.map((v) => FixedPrecision.toScaled(v, ctx));
    const rawB = b.map((v) => FixedPrecision.toScaled(v, ctx));
    const result = cross_product(rawA, rawB, ctx.SCALE);
    return result.map((v) => FixedPrecision.fromRawWithContext(v, ctx));
  }

  private static normalized(v: FixedPrecisionValue): FixedPrecision {
    if (v instanceof FixedPrecision) {
      const ctx = FixedPrecision.defaultContext;
      if (
        v.ctx.places === ctx.places &&
        v.ctx.roundingMode === ctx.roundingMode
      ) {
        return v;
      }
      return v.scale(ctx.places, ctx.roundingMode);
    } else {
      return new FixedPrecision(v);
    }
  }

  public static min(
    val: FixedPrecisionValue | FixedPrecisionValue[],
    ...vals: FixedPrecisionValue[]
  ): FixedPrecision {
    const values = collectValues(val, vals);
    return min_values(
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
    return max_values(
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
    const total = sum_values(
      values.slice(1),
      first.value,
      (value) => FixedPrecision.normalized(value).value,
    );
    return FixedPrecision.fromRawWithContext(total, first.ctx);
  }

  public static hypot(
    val?: FixedPrecisionValue | FixedPrecisionValue[],
    ...vals: FixedPrecisionValue[]
  ): FixedPrecision {
    const ctx = FixedPrecision.defaultContext;
    if (val === undefined) {
      return new FixedPrecision(0n, ctx);
    }

    const values = collectValues(val, vals);
    let total = 0n;
    for (const value of values) {
      const rawValue = FixedPrecision.normalized(value).value;
      total += (rawValue * rawValue) / ctx.SCALE;
    }
    return FixedPrecision.fromRawWithContext(sqrt_value(total, ctx.SCALE), ctx);
  }

  public static factorial(n: number | FixedPrecision): FixedPrecision {
    const ctx =
      n instanceof FixedPrecision ? n.ctx : FixedPrecision.defaultContext;
    const val =
      n instanceof FixedPrecision ? n.trunc().toNumber() : Math.trunc(n);
    return FixedPrecision.fromRawWithContext(
      factorial_value(val) * ctx.SCALE,
      ctx,
    );
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
    return FixedPrecision.fromRawWithContext(
      permutations_value(valN, valK) * ctx.SCALE,
      ctx,
    );
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
    return FixedPrecision.fromRawWithContext(
      combinations_value(valN, valK) * ctx.SCALE,
      ctx,
    );
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
      FixedPrecision.fromRawWithContext(10n ** BigInt(Math.abs(exp)), this.ctx),
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
    return this.scale(places, rm).toString();
  }

  public toBinary(sd?: number, rm?: RoundingMode): string {
    return to_base_with_ctx(this.value, this.ctx, 2, sd, rm);
  }

  public toOctal(sd?: number, rm?: RoundingMode): string {
    return to_base_with_ctx(this.value, this.ctx, 8, sd, rm);
  }

  public toHex(sd?: number, rm?: RoundingMode): string {
    return to_base_with_ctx(this.value, this.ctx, 16, sd, rm);
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
