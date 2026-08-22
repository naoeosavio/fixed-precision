import { cbrt_value } from "./core/arithmetic/cbrt";
import { exp_value } from "./core/arithmetic/exp";
import { log_value } from "./core/arithmetic/log";
import { log2_value } from "./core/arithmetic/log2";
import { log10_value } from "./core/arithmetic/log10";
import { natural_log_value } from "./core/arithmetic/naturalLog";
import { power } from "./core/arithmetic/power";
import { precision_value } from "./core/arithmetic/precision";
import { round_value } from "./core/arithmetic/round";
import { round_to_scale_value } from "./core/arithmetic/roundToScale";
import { scale_value } from "./core/arithmetic/scale";
import { shifted_by_value } from "./core/arithmetic/shiftedBy";
import { significant_digits_value } from "./core/arithmetic/significantDigits";
import { sqrt_value } from "./core/arithmetic/sqrt";
import {
  combinations_value,
  factorial_value,
  permutations_value,
} from "./core/combinatorics/index";
import {
  configureContext,
  FactoryContext,
  makeContext,
} from "./core/construction/context";
import { fraction_value } from "./core/fractions/fraction";
import { get_denominator } from "./core/fractions/getDenominator";
import { get_numerator } from "./core/fractions/getNumerator";
import {
  isNegativeValue,
  isPositiveValue,
  isZeroValue,
  logicalAndValues,
  logicalNotValue,
  logicalOrValues,
  logicalXorValues,
} from "./core/logical/index";
import { cross_product } from "./core/matrix/crossProduct";
import { dot_product } from "./core/matrix/dotProduct";
import { from_number_with_ctx } from "./core/numeric/fromNumber";
import { to_number_with_ctx } from "./core/numeric/toNumber";
import {
  compareValues,
  equalsValue,
  greaterThanOrEqualValue,
  greaterThanValue,
  lessThanOrEqualValue,
  lessThanValue,
} from "./core/relational/index";
import { from_string_with_ctx } from "./core/string/fromString";
import { to_base_with_ctx } from "./core/string/toBase";
import { to_string_with_ctx } from "./core/string/toString";
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
} from "./core/trigonometry/index";

export const FP_BRAND: unique symbol = Symbol("fixed-precision");
export type RoundingMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Comparison = -1 | 0 | 1;
export type FixedPrecisionValue = string | number | bigint | FixedPrecision;

export type FPContext = {
  places: number;
  roundingMode: RoundingMode;
  SCALE: bigint;
  SCALENUMBER: number;
};

export interface FixedPrecisionConfig {
  places: number;
  roundingMode?: RoundingMode;
}

export default class FixedPrecision {
  private value: bigint = 0n;
  private readonly ctx!: FPContext;

  readonly [FP_BRAND] = true as const;

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
    return (
      typeof value === "object" &&
      value !== null &&
      (value as FixedPrecision)[FP_BRAND] === true
    );
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

  private static toScaled(value: FixedPrecisionValue, ctx: FPContext): bigint {
    if (value instanceof FixedPrecision) {
      if (
        value.ctx.places === ctx.places &&
        value.ctx.roundingMode === ctx.roundingMode
      ) {
        return value.value;
      }
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

  private coerce(value: FixedPrecisionValue): FixedPrecision {
    if (value instanceof FixedPrecision) {
      if (
        this.ctx.places !== value.ctx.places ||
        this.ctx.roundingMode !== value.ctx.roundingMode
      ) {
        throw new Error("Cannot operate on different precisions");
      }
      return value;
    }
    return new FixedPrecision(value, this.ctx);
  }

  private static strictCtx(values: FixedPrecisionValue[]): FPContext {
    let target: FPContext | null = null;
    for (const v of values) {
      if (v instanceof FixedPrecision) {
        if (target === null) {
          target = v.ctx;
        } else if (
          target.places !== v.ctx.places ||
          target.roundingMode !== v.ctx.roundingMode
        ) {
          throw new Error("Cannot operate on different precisions");
        }
      }
    }
    return target ?? FixedPrecision.defaultContext;
  }

  private static resolveContext(values: FixedPrecisionValue[]): FPContext {
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

  private static normalizeTo(
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
      return FixedPrecision.fromRawWithContext(
        scale_value(v.value, ctx.places, ctx.roundingMode, v.ctx),
        ctx,
      );
    }
    return new FixedPrecision(v, ctx);
  }

  public context(): FPContext {
    return this.ctx;
  }

  public toNumber(places?: number): number {
    if (places === undefined) {
      return to_number_with_ctx(this.value, this.ctx);
    }
    const scaled = this.scale(places);
    return to_number_with_ctx(scaled.value, scaled.ctx);
  }

  public toString(trimZeros = true): string {
    return to_string_with_ctx(this.value, this.ctx, trimZeros);
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
    return this.fromRaw(this.value + this.toScaledValue(other));
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
    const otherRaw = this.coerce(other).value;
    const quotientRaw = (this.value * this.ctx.SCALE) / otherRaw;
    return {
      quotient: this.fromRaw(quotientRaw),
      remainder: this.fromRaw(
        this.value - (quotientRaw * otherRaw) / this.ctx.SCALE,
      ),
    };
  }

  public idivmod(other: FixedPrecisionValue): {
    quotient: FixedPrecision;
    remainder: FixedPrecision;
  } {
    const otherRaw = this.coerce(other).value;
    const quotientRaw = (this.value / otherRaw) * this.ctx.SCALE;
    return {
      quotient: this.fromRaw(quotientRaw),
      remainder: this.fromRaw(
        this.value - (quotientRaw * otherRaw) / this.ctx.SCALE,
      ),
    };
  }

  public rest(other: FixedPrecisionValue): FixedPrecision {
    return this.divmod(other).remainder;
  }

  public dividedToIntegerBy(other: FixedPrecisionValue): FixedPrecision {
    return this.idiv(other);
  }

  public clamp(
    min: FixedPrecisionValue,
    max: FixedPrecisionValue,
  ): FixedPrecision {
    const minRaw = this.coerce(min).value;
    const maxRaw = this.coerce(max).value;
    if (minRaw > maxRaw) {
      throw new Error("min must be less than or equal to max");
    }
    return this.fromRaw(
      this.value < minRaw ? minRaw : this.value > maxRaw ? maxRaw : this.value,
    );
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
    const stepRaw = this.coerce(increment).value;
    const step = stepRaw < 0n ? -stepRaw : stepRaw;
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
    return this.fromRaw(
      get_numerator(this.value, this.ctx.SCALE) * this.ctx.SCALE,
    );
  }

  public den(): FixedPrecision {
    return this.fromRaw(
      get_denominator(this.value, this.ctx.SCALE) * this.ctx.SCALE,
    );
  }

  public fraction(
    maxDen?: FixedPrecisionValue,
  ): [FixedPrecision, FixedPrecision] {
    const maxDenRaw =
      maxDen === undefined
        ? undefined
        : scale_value(this.coerce(maxDen).value, 0, 1, this.ctx);
    const result =
      maxDenRaw === undefined
        ? fraction_value(this.value, this.ctx.SCALE)
        : fraction_value(this.value, this.ctx.SCALE, maxDenRaw);
    return [
      this.fromRaw(result.numerator * this.ctx.SCALE),
      this.fromRaw(result.denominator * this.ctx.SCALE),
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
    const instance = new FixedPrecision(0n, makeContext(newScale, rm));
    instance.value = nextValue;
    return instance;
  }

  public prec(
    sd: number,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    return this.fromRaw(precision_value(this.value, sd, rm, this.ctx));
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

  public toExponential(dp?: number, rm?: RoundingMode): string {
    const effDp = dp ?? this.ctx.places;
    const rounded = this.round(effDp, rm);
    const [int = "", frac = ""] = rounded.toString().split(".");
    const absInt = int.replace(/^-/, "");
    const exp =
      absInt.length > 1
        ? absInt.length - 1
        : absInt === "0"
          ? -frac.search(/[1-9]/) - 1
          : 0;
    const shifted = rounded.shiftedBy(-exp);
    return `${shifted.toFixed(effDp)}e${exp}`
      .replace(/\.0+e/, "e")
      .replace(/(\.\d+?)0+e/, "$1e");
  }

  public toPrecision(sd: number, rm?: RoundingMode): string {
    if (this.value === 0n) {
      return "0";
    }
    const raw = precision_value(
      this.value,
      sd,
      rm ?? this.ctx.roundingMode,
      this.ctx,
    );
    if (raw === 0n) return "0";

    const absRaw = raw < 0n ? -raw : raw;
    const digitLength = absRaw.toString().length;
    const places = this.ctx.places;

    let exp: number;
    if (absRaw >= this.ctx.SCALE) {
      exp = digitLength - places - 1;
    } else {
      exp = -(places - digitLength + 1);
    }

    if (exp < -6 || exp >= sd) {
      const mantissa = this.fromRaw(shifted_by_value(raw, -exp));
      let formatted = mantissa.toFixed(sd - 1, rm);
      formatted += `e${exp > 0 ? "+" : ""}${exp}`;
      return formatted;
    }

    return this.fromRaw(raw)
      .toString()
      .replace(/(\.\d*?)0+$/, "$1")
      .replace(/\.$/, "");
  }

  public toFixed(places = 0, rm?: RoundingMode): string {
    return this.scale(places, rm).toString(false);
  }

  public toBinary(sd?: number, rm?: RoundingMode): string {
    return this.toBase(2, sd, rm);
  }

  public toOctal(sd?: number, rm?: RoundingMode): string {
    return this.toBase(8, sd, rm);
  }

  public toHex(sd?: number, rm?: RoundingMode): string {
    return this.toBase(16, sd, rm);
  }

  public toHexadecimal(sd?: number, rm?: RoundingMode): string {
    return this.toHex(sd, rm);
  }

  public toBase(base: 2 | 8 | 16, sd?: number, rm?: RoundingMode): string {
    return to_base_with_ctx(this.value, this.ctx, base, sd, rm);
  }

  public toJSON(): string {
    return this.toString();
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

  public static sign(value: FixedPrecisionValue): number {
    if (value instanceof FixedPrecision) {
      return compareValues(value.value, 0n);
    }
    if (typeof value === "bigint") {
      return compareValues(value, 0n);
    }
    if (typeof value === "number") {
      if (Number.isNaN(value)) return NaN;
      return value === 0 ? value : value < 0 ? -1 : 1;
    }
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return NaN;
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

  public static not(value: FixedPrecisionValue): boolean {
    return logicalNotValue(
      FixedPrecision.toScaled(value, FixedPrecision.strictCtx([value])),
    );
  }

  public static and(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): boolean {
    const ctx = FixedPrecision.strictCtx([left, right]);
    return logicalAndValues(
      FixedPrecision.toScaled(left, ctx),
      FixedPrecision.toScaled(right, ctx),
    );
  }

  public static or(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): boolean {
    const ctx = FixedPrecision.strictCtx([left, right]);
    return logicalOrValues(
      FixedPrecision.toScaled(left, ctx),
      FixedPrecision.toScaled(right, ctx),
    );
  }

  public static xor(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): boolean {
    const ctx = FixedPrecision.strictCtx([left, right]);
    return logicalXorValues(
      FixedPrecision.toScaled(left, ctx),
      FixedPrecision.toScaled(right, ctx),
    );
  }

  public static PI(): FixedPrecision {
    return new FixedPrecision("3.14159265358979323846");
  }

  public static e(): FixedPrecision {
    return new FixedPrecision("2.71828182845904523536");
  }

  public static exp(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      exp_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static abs(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    const raw = FixedPrecision.toScaled(value, ctx);
    return FixedPrecision.fromRawWithContext(raw < 0n ? -raw : raw, ctx);
  }

  public static add(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([left, right]);
    return FixedPrecision.fromRawWithContext(
      FixedPrecision.toScaled(left, ctx) + FixedPrecision.toScaled(right, ctx),
      ctx,
    );
  }

  public static sub(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([left, right]);
    return FixedPrecision.fromRawWithContext(
      FixedPrecision.toScaled(left, ctx) - FixedPrecision.toScaled(right, ctx),
      ctx,
    );
  }

  public static mul(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([left, right]);
    return FixedPrecision.fromRawWithContext(
      (FixedPrecision.toScaled(left, ctx) *
        FixedPrecision.toScaled(right, ctx)) /
        ctx.SCALE,
      ctx,
    );
  }

  public static div(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([left, right]);
    return FixedPrecision.fromRawWithContext(
      (FixedPrecision.toScaled(left, ctx) * ctx.SCALE) /
        FixedPrecision.toScaled(right, ctx),
      ctx,
    );
  }

  public static mod(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([left, right]);
    return FixedPrecision.fromRawWithContext(
      (FixedPrecision.toScaled(left, ctx) * ctx.SCALE) %
        FixedPrecision.toScaled(right, ctx),
      ctx,
    );
  }

  public static idiv(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([left, right]);
    return FixedPrecision.fromRawWithContext(
      (FixedPrecision.toScaled(left, ctx) /
        FixedPrecision.toScaled(right, ctx)) *
        ctx.SCALE,
      ctx,
    );
  }

  public static pow(value: FixedPrecisionValue, exp: number): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      power(FixedPrecision.toScaled(value, ctx), exp, ctx.SCALE),
      ctx,
    );
  }

  public static ceil(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      round_value(FixedPrecision.toScaled(value, ctx), 0, 2, ctx),
      ctx,
    );
  }

  public static floor(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      round_value(FixedPrecision.toScaled(value, ctx), 0, 3, ctx),
      ctx,
    );
  }

  public static trunc(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      round_value(FixedPrecision.toScaled(value, ctx), 0, 1, ctx),
      ctx,
    );
  }

  public static round(
    value: FixedPrecisionValue,
    dp?: number,
    rm?: RoundingMode,
  ): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      round_value(
        FixedPrecision.toScaled(value, ctx),
        dp ?? ctx.places,
        rm ?? ctx.roundingMode,
        ctx,
      ),
      ctx,
    );
  }

  public static ln(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      natural_log_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static log(
    value: FixedPrecisionValue,
    base?: FixedPrecisionValue,
  ): FixedPrecision {
    if (base === undefined) {
      const ctx = FixedPrecision.strictCtx([value]);
      return FixedPrecision.fromRawWithContext(
        natural_log_value(FixedPrecision.toScaled(value, ctx), ctx),
        ctx,
      );
    }
    const ctx = FixedPrecision.strictCtx([value, base]);
    return FixedPrecision.fromRawWithContext(
      log_value(
        FixedPrecision.toScaled(value, ctx),
        FixedPrecision.toScaled(base, ctx),
        ctx,
      ),
      ctx,
    );
  }

  public static log2(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      log2_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static log10(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      log10_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static clamp(
    value: FixedPrecisionValue,
    min: FixedPrecisionValue,
    max: FixedPrecisionValue,
  ): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value, min, max]);
    const raw = FixedPrecision.toScaled(value, ctx);
    const minRaw = FixedPrecision.toScaled(min, ctx);
    const maxRaw = FixedPrecision.toScaled(max, ctx);
    if (minRaw > maxRaw) {
      throw new Error("min must be less than or equal to max");
    }
    return FixedPrecision.fromRawWithContext(
      raw < minRaw ? minRaw : raw > maxRaw ? maxRaw : raw,
      ctx,
    );
  }

  public static square(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      power(FixedPrecision.toScaled(value, ctx), 2, ctx.SCALE),
      ctx,
    );
  }

  public static cube(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      power(FixedPrecision.toScaled(value, ctx), 3, ctx.SCALE),
      ctx,
    );
  }

  public static sqrt(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      sqrt_value(FixedPrecision.toScaled(value, ctx), ctx.SCALE),
      ctx,
    );
  }

  public static cbrt(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      cbrt_value(FixedPrecision.toScaled(value, ctx), ctx.SCALE),
      ctx,
    );
  }

  public static sin(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      sin_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static cos(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      cos_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static tan(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      tan_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static sec(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      sec_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static csc(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      csc_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static cot(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      cot_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static asin(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      asin_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static acos(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      acos_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static atan(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      atan_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static atan2(
    y: FixedPrecisionValue,
    x: FixedPrecisionValue,
  ): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([y, x]);
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
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      acot_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static asec(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      asec_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static acsc(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      acsc_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static sinh(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      sinh_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static cosh(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      cosh_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static tanh(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      tanh_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static sech(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      sech_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static csch(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      csch_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static coth(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      coth_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static asinh(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      asinh_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static acosh(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      acosh_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static atanh(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      atanh_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static asech(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      asech_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static acsch(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      acsch_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static acoth(value: FixedPrecisionValue): FixedPrecision {
    const ctx = FixedPrecision.strictCtx([value]);
    return FixedPrecision.fromRawWithContext(
      acoth_value(FixedPrecision.toScaled(value, ctx), ctx),
      ctx,
    );
  }

  public static phi(): FixedPrecision {
    return new FixedPrecision("1.61803398874989484820");
  }

  public static sqrt2(): FixedPrecision {
    return new FixedPrecision("1.41421356237309504880");
  }

  public static random(decimalPlaces?: number): FixedPrecision {
    const dec = decimalPlaces ?? FixedPrecision.defaultContext.places;
    let rand = 0n;
    for (let i = 0; i < dec; i++) {
      rand = rand * 10n + BigInt(Math.floor(Math.random() * 10));
    }
    return FixedPrecision.fromRawWithContext(
      rand,
      makeContext(dec, FixedPrecision.defaultContext.roundingMode),
    );
  }

  public static dot(
    a: FixedPrecisionValue[],
    b: FixedPrecisionValue[],
  ): FixedPrecision {
    const ctx = FixedPrecision.resolveContext([...a, ...b]);
    const rawA = a.map((v) => FixedPrecision.toScaled(v, ctx));
    const rawB = b.map((v) => FixedPrecision.toScaled(v, ctx));
    return FixedPrecision.fromRawWithContext(
      dot_product(rawA, rawB, ctx.SCALE),
      ctx,
    );
  }

  public static cross(
    a: FixedPrecisionValue[],
    b: FixedPrecisionValue[],
  ): FixedPrecision[] {
    const ctx = FixedPrecision.resolveContext([...a, ...b]);
    const rawA = a.map((v) => FixedPrecision.toScaled(v, ctx));
    const rawB = b.map((v) => FixedPrecision.toScaled(v, ctx));
    return cross_product(rawA, rawB, ctx.SCALE).map((v) =>
      FixedPrecision.fromRawWithContext(v, ctx),
    );
  }

  public static min(
    val: FixedPrecisionValue | FixedPrecisionValue[],
    ...vals: FixedPrecisionValue[]
  ): FixedPrecision {
    const items = Array.isArray(val) ? [...val, ...vals] : [val, ...vals];
    const first = items[0];
    if (first === undefined) {
      throw new Error("FixedPrecision.min requires at least one argument");
    }
    const ctx = FixedPrecision.resolveContext(items);
    let result = FixedPrecision.normalizeTo(first, ctx);
    for (const item of items.slice(1)) {
      const next = FixedPrecision.normalizeTo(item, ctx);
      if (next.lt(result)) result = next;
    }
    return result;
  }

  public static max(
    val: FixedPrecisionValue | FixedPrecisionValue[],
    ...vals: FixedPrecisionValue[]
  ): FixedPrecision {
    const items = Array.isArray(val) ? [...val, ...vals] : [val, ...vals];
    const first = items[0];
    if (first === undefined) {
      throw new Error("FixedPrecision.max requires at least one argument");
    }
    const ctx = FixedPrecision.resolveContext(items);
    let result = FixedPrecision.normalizeTo(first, ctx);
    for (const item of items.slice(1)) {
      const next = FixedPrecision.normalizeTo(item, ctx);
      if (next.gt(result)) result = next;
    }
    return result;
  }

  public static sum(
    val: FixedPrecisionValue | FixedPrecisionValue[],
    ...vals: FixedPrecisionValue[]
  ): FixedPrecision {
    const items = Array.isArray(val) ? [...val, ...vals] : [val, ...vals];
    const first = items[0];
    if (first === undefined) {
      return new FixedPrecision(0n);
    }
    const ctx = FixedPrecision.resolveContext(items);
    let total = 0n;
    for (const item of items) {
      total += FixedPrecision.normalizeTo(item, ctx).value;
    }
    return FixedPrecision.fromRawWithContext(total, ctx);
  }

  public static hypot(
    val?: FixedPrecisionValue | FixedPrecisionValue[],
    ...vals: FixedPrecisionValue[]
  ): FixedPrecision {
    if (val === undefined) {
      return new FixedPrecision(0n);
    }
    const items = Array.isArray(val) ? [...val, ...vals] : [val, ...vals];
    const ctx = FixedPrecision.resolveContext(items);
    let total = 0n;
    for (const item of items) {
      const raw = FixedPrecision.toScaled(item, ctx);
      total += (raw * raw) / ctx.SCALE;
    }
    return FixedPrecision.fromRawWithContext(sqrt_value(total, ctx.SCALE), ctx);
  }

  public static factorial(n: number | FixedPrecision): FixedPrecision {
    const ctx = FixedPrecision.resolveContext(
      n instanceof FixedPrecision ? [n] : [],
    );
    const val =
      n instanceof FixedPrecision
        ? Number(toTruncatedInteger(n))
        : Math.trunc(n);
    return FixedPrecision.fromRawWithContext(
      factorial_value(val) * ctx.SCALE,
      ctx,
    );
  }

  public static permutations(
    n: number | FixedPrecision,
    k: number | FixedPrecision,
  ): FixedPrecision {
    const ctx = FixedPrecision.resolveContext(
      n instanceof FixedPrecision ? [n] : [],
    );
    const valN =
      n instanceof FixedPrecision
        ? Number(toTruncatedInteger(n))
        : Math.trunc(n);
    const valK =
      k instanceof FixedPrecision
        ? Number(toTruncatedInteger(k))
        : Math.trunc(k);
    return FixedPrecision.fromRawWithContext(
      permutations_value(valN, valK) * ctx.SCALE,
      ctx,
    );
  }

  public static combinations(
    n: number | FixedPrecision,
    k: number | FixedPrecision,
  ): FixedPrecision {
    const ctx = FixedPrecision.resolveContext(
      n instanceof FixedPrecision ? [n] : [],
    );
    const valN =
      n instanceof FixedPrecision
        ? Number(toTruncatedInteger(n))
        : Math.trunc(n);
    const valK =
      k instanceof FixedPrecision
        ? Number(toTruncatedInteger(k))
        : Math.trunc(k);
    return FixedPrecision.fromRawWithContext(
      combinations_value(valN, valK) * ctx.SCALE,
      ctx,
    );
  }
}

function toTruncatedInteger(instance: FixedPrecision): bigint {
  return instance.raw() / instance.context().SCALE;
}

export const fixedconfig = {
  configure: FixedPrecision.configure.bind(FixedPrecision),
};
