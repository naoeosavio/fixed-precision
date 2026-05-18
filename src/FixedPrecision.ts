import {
  addRaw,
  divRaw,
  modRaw,
  mulRaw,
  negRaw,
  powRaw,
  subRaw,
} from "./functions/arithmetic/operations";
import { collectValues } from "./functions/construction/values";
import {
  configureContext,
  makeContext,
  makeFactoryContext,
} from "./functions/core/context";
import {
  fixedPrecisionType,
  rawValue,
  valueOfString,
} from "./functions/expression/primitive";
import { sqrtWithNewton } from "./functions/geometry/sqrt";
import {
  isNegativeValue,
  isPositiveValue,
  isZeroValue,
} from "./functions/logical/sign";
import {
  eNumber,
  phiNumber,
  piNumber,
  sqrt2Number,
} from "./functions/numeric/constants";
import { fromNumberWithCtx, toNumberWithCtx } from "./functions/numeric/number";
import {
  absoluteValue,
  roundToScaleValue,
  roundValue,
  scaleValue,
  shiftedByValue,
} from "./functions/numeric/rounding";
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
import { toFixedWithCtx, toStringWithCtx } from "./functions/string/format";
import { fromStringWithCtx } from "./functions/string/parse";

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

  protected fromRaw(rawValue: bigint): FixedPrecision {
    const instance = new FixedPrecision(0n, this.ctx);
    instance.value = rawValue;
    return instance;
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
    return this.fromRaw(absoluteValue(this.value));
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

  public add(other: FixedPrecisionValue): FixedPrecision {
    const o = this.coerce(other);
    return this.fromRaw(addRaw(this.value, o.value));
  }

  public plus(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(addRaw(this.value, this.toScaledValue(other)));
  }

  public sub(other: FixedPrecisionValue): FixedPrecision {
    const o = this.coerce(other);
    return this.fromRaw(subRaw(this.value, o.value));
  }

  public minus(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(subRaw(this.value, this.toScaledValue(other)));
  }

  public mul(other: FixedPrecisionValue): FixedPrecision {
    const o = this.coerce(other);
    return this.fromRaw(divRaw(mulRaw(this.value, o.value), this.ctx.SCALE));
  }

  public product(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(mulRaw(this.value, this.toScaledValue(other)));
  }

  public div(other: FixedPrecisionValue): FixedPrecision {
    const o = this.coerce(other);
    return this.fromRaw(divRaw(mulRaw(this.value, this.ctx.SCALE), o.value));
  }

  public fraction(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(divRaw(this.value, this.toScaledValue(other)));
  }

  public mod(other: FixedPrecisionValue): FixedPrecision {
    const o = this.coerce(other);
    return this.fromRaw(modRaw(mulRaw(this.value, this.ctx.SCALE), o.value));
  }

  public leftover(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(modRaw(this.value, this.toScaledValue(other)));
  }

  public neg(): FixedPrecision {
    return this.fromRaw(negRaw(this.value));
  }

  public pow(exp: number): FixedPrecision {
    return this.fromRaw(powRaw(this.value, exp, this.ctx.SCALE));
  }

  public static PI(): FixedPrecision {
    return new FixedPrecision(piNumber());
  }

  public static e(): FixedPrecision {
    return new FixedPrecision(eNumber());
  }

  public static phi(): FixedPrecision {
    return new FixedPrecision(phiNumber());
  }

  public static sqrt2(): FixedPrecision {
    return new FixedPrecision(sqrt2Number());
  }

  public sqrt(): FixedPrecision {
    return sqrtWithNewton<FixedPrecision>(
      this,
      this.ctx.places,
      () => new FixedPrecision(0n, this.ctx),
    );
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

  public round(dp?: number, rm?: RoundingMode): FixedPrecision {
    return this.fromRaw(roundValue(this.value, dp, rm, this.ctx));
  }

  public scale(newScale: number, rm?: RoundingMode): FixedPrecision {
    return this.fromRaw(scaleValue(this.value, newScale, rm, this.ctx));
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

  public valueOf(): string {
    return valueOfString(this.toString());
  }

  public typeof(): "FixedPrecision" {
    return fixedPrecisionType();
  }

  public raw(): bigint {
    return rawValue(this.value);
  }
}

export const fixedconfig = {
  configure: FixedPrecision.configure.bind(FixedPrecision),
};
