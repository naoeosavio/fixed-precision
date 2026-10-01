import {
  power,
  precision_value,
  round_value,
  scale_value,
  sqrt_value,
} from "./core/arithmetic";
import {
  assertPlaces,
  assertRoundingMode,
  type Comparison,
  DEFAULT_ROUNDING_MODE,
  type FixedPrecisionConfig,
  type FPContext,
  MAX_PLACES,
  makeContext,
  preferContext,
  type RoundingMode,
} from "./core/construction";
import { from_number_with_ctx, to_number_with_ctx } from "./core/numeric";
import { from_string_with_ctx, to_string_with_ctx } from "./core/string";
import { to_exponential_with_ctx } from "./core/string/toExponential";
import { precisionPowerOfTen, zero_with_precision } from "./core/utils";

export type {
  Comparison,
  FixedPrecisionConfig,
  FPContext,
  RoundingMode,
} from "./core/construction";

export type FixedPrecisionValue = string | number | bigint | FixedPrecision;

export default class FixedPrecision {
  private value: bigint;
  private readonly ctx: FPContext;
  private static defaultContext = makeContext(8, 4);

  public static configure(config: FixedPrecisionConfig): void {
    assertPlaces(config.places);
    const places = config.places ?? FixedPrecision.defaultContext.places;
    const roundingMode =
      config.roundingMode ?? FixedPrecision.defaultContext.roundingMode;
    assertRoundingMode(roundingMode);
    FixedPrecision.defaultContext = makeContext(places, roundingMode);
  }

  public static create(
    config: FixedPrecisionConfig,
  ): (val: FixedPrecisionValue) => FixedPrecision {
    assertPlaces(config.places);
    const roundingMode = config.roundingMode ?? DEFAULT_ROUNDING_MODE;
    assertRoundingMode(roundingMode);
    const ctx = makeContext(config.places, roundingMode);
    return (value: FixedPrecisionValue) => new FixedPrecision(value, ctx);
  }

  public constructor(value: FixedPrecisionValue, ctx?: FPContext) {
    this.ctx = ctx ?? FixedPrecision.defaultContext;
    this.value = FixedPrecision.toScaled(value, this.ctx);
  }

  protected fromRaw(rawValue: bigint): FixedPrecision {
    const instance = new FixedPrecision(0n, this.ctx);
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

  private coerce(value: FixedPrecisionValue): bigint {
    if (value instanceof FixedPrecision) {
      if (this.ctx.places !== value.ctx.places) {
        throw new Error("Cannot operate on different precisions");
      }
      return value.value;
    }
    return FixedPrecision.toScaled(value, this.ctx);
  }

  public static random(decimalPlaces?: number): FixedPrecision {
    const dec = decimalPlaces ?? FixedPrecision.defaultContext.places;
    let rand = 0n;
    for (let i = 0; i < dec; i++) {
      rand = rand * 10n + BigInt(Math.trunc(Math.random() * 10));
    }

    const instance = new FixedPrecision(
      0n,
      makeContext(dec, FixedPrecision.defaultContext.roundingMode),
    );
    instance.value = rand;
    return instance;
  }

  private static resolveContext(values: FixedPrecisionValue[]): FPContext {
    let best: FPContext | null = null;
    for (const v of values) {
      if (v instanceof FixedPrecision) {
        best = preferContext(best, v.ctx);
        if (best.places === MAX_PLACES) return best;
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
      return v.scale(ctx.places, ctx.roundingMode);
    } else {
      return new FixedPrecision(v, ctx);
    }
  }

  public static min(
    value: FixedPrecisionValue | FixedPrecisionValue[],
    ...values: FixedPrecisionValue[]
  ): FixedPrecision {
    const items = Array.isArray(value)
      ? [...value, ...values]
      : [value, ...values];
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
    value: FixedPrecisionValue | FixedPrecisionValue[],
    ...values: FixedPrecisionValue[]
  ): FixedPrecision {
    const items = Array.isArray(value)
      ? [...value, ...values]
      : [value, ...values];
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
    value: FixedPrecisionValue | FixedPrecisionValue[],
    ...values: FixedPrecisionValue[]
  ): FixedPrecision {
    const items = Array.isArray(value)
      ? [...value, ...values]
      : [value, ...values];
    const first = items[0];
    if (first === undefined) return new FixedPrecision(0n);

    const ctx = FixedPrecision.resolveContext(items);
    let total = 0n;
    for (const item of items) {
      total += FixedPrecision.normalizeTo(item, ctx).value;
    }
    const instance = new FixedPrecision(0n, ctx);
    instance.value = total;
    return instance;
  }

  public abs(): FixedPrecision {
    return this.fromRaw(this.value < 0n ? -this.value : this.value);
  }

  public cmp(other: FixedPrecisionValue): Comparison {
    const value = this.coerce(other);
    return this.value < value ? -1 : this.value > value ? 1 : 0;
  }

  public eq(other: FixedPrecisionValue): boolean {
    return this.value === this.coerce(other);
  }

  public gt(other: FixedPrecisionValue): boolean {
    return this.value > this.coerce(other);
  }

  public gte(other: FixedPrecisionValue): boolean {
    return this.value >= this.coerce(other);
  }

  public lt(other: FixedPrecisionValue): boolean {
    return this.value < this.coerce(other);
  }

  public lte(other: FixedPrecisionValue): boolean {
    return this.value <= this.coerce(other);
  }

  public isInteger(): boolean {
    return this.value % this.ctx.SCALE === 0n;
  }

  public isNegative(): boolean {
    return this.value < 0n;
  }

  public isPositive(): boolean {
    return this.value > 0n;
  }

  public isZero(): boolean {
    return this.value === 0n;
  }

  public add(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value + this.coerce(other));
  }

  public plus(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value + this.toScaledValue(other));
  }

  public sub(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value - this.coerce(other));
  }

  public minus(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value - this.toScaledValue(other));
  }

  public mul(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw((this.value * this.coerce(other)) / this.ctx.SCALE);
  }

  public times(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value * this.toScaledValue(other));
  }

  public div(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw((this.value * this.ctx.SCALE) / this.coerce(other));
  }

  public idiv(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw((this.value / this.coerce(other)) * this.ctx.SCALE);
  }

  public ratio(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value / this.toScaledValue(other));
  }

  public mod(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw((this.value * this.ctx.SCALE) % this.coerce(other));
  }

  public rem(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value % this.toScaledValue(other));
  }
  public divmod(other: FixedPrecisionValue): {
    quotient: FixedPrecision;
    remainder: FixedPrecision;
  } {
    const coerced = this.coerce(other);
    const quotient = this.fromRaw((this.value * this.ctx.SCALE) / coerced);

    return {
      quotient,
      remainder: this.fromRaw(
        this.value - (quotient.value * coerced) / this.ctx.SCALE,
      ),
    };
  }

  public idivmod(other: FixedPrecisionValue): {
    quotient: FixedPrecision;
    remainder: FixedPrecision;
  } {
    const coerced = this.coerce(other);
    const quotient = this.fromRaw((this.value / coerced) * this.ctx.SCALE);

    return {
      quotient,
      remainder: this.fromRaw(
        this.value - (quotient.value * coerced) / this.ctx.SCALE,
      ),
    };
  }

  public rest(other: FixedPrecisionValue): FixedPrecision {
    const d = this.divmod(other);
    return d.remainder;
  }

  public neg(): FixedPrecision {
    return this.fromRaw(-this.value);
  }

  public pow(exp: number): FixedPrecision {
    return this.fromRaw(power(this.value, exp, this.ctx.SCALE));
  }

  public square(): FixedPrecision {
    return this.mul(this);
  }

  public sqrt(): FixedPrecision {
    return this.fromRaw(sqrt_value(this.value, this.ctx.SCALE));
  }

  public round(
    dp = this.ctx.places,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    return this.fromRaw(round_value(this.value, dp, rm, this.ctx));
  }

  public scale(
    newScale: number,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    const nextValue = scale_value(this.value, newScale, rm, this.ctx);
    const nextCtx = makeContext(newScale, rm);
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

  public trunc(): FixedPrecision {
    return this.round(0, 1);
  }

  public ceil(): FixedPrecision {
    return this.round(0, 2);
  }

  public floor(): FixedPrecision {
    return this.round(0, 3);
  }

  public shiftedBy(n: number): FixedPrecision {
    const factor = precisionPowerOfTen(Math.abs(n));
    return this.fromRaw(n >= 0 ? this.value * factor : this.value / factor);
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

  public toFixed(places = 0, rm: RoundingMode = this.ctx.roundingMode): string {
    return this.scale(places, rm).toString(false);
  }

  public toExponential(dp = this.ctx.places, rm?: RoundingMode): string {
    return to_exponential_with_ctx(this.value, this.ctx, dp, rm);
  }

  public toPrecision(sd: number, rm?: RoundingMode): string {
    if (sd >= 1e6) throw new Error("Invalid precision");
    if (this.value === 0n) return zero_with_precision(sd);

    const raw = precision_value(
      this.value,
      sd,
      rm ?? this.ctx.roundingMode,
      this.ctx,
    );
    if (raw === 0n) return zero_with_precision(sd);

    const absRaw = raw < 0n ? -raw : raw;
    const digitLength = absRaw.toString().length;
    const places = this.ctx.places;

    let exp: number;
    if (absRaw >= this.ctx.SCALE) {
      exp = digitLength - places - 1;
    } else {
      const padLength = places - digitLength;
      exp = -(padLength + 1);
    }

    if (exp < -6 || exp >= sd) {
      const shiftFactor = precisionPowerOfTen(Math.abs(exp));
      const mantissaRaw = exp >= 0 ? raw / shiftFactor : raw * shiftFactor;
      const mantissa = this.fromRaw(mantissaRaw);
      const dp = sd - 1;
      let formatted = mantissa.toFixed(dp, rm);
      const expSign = exp > 0 ? "+" : "";
      formatted += `e${expSign}${exp}`;
      return formatted;
    }

    return this.fromRaw(raw)
      .toString()
      .replace(/(\.\d*?)0+$/, "$1")
      .replace(/\.$/, "");
  }

  public toFormat(dp = this.ctx.places, rm?: RoundingMode): string {
    const value = this.toFixed(dp, rm);
    const [integer = "", fraction] = value.split(".");
    const sign = integer[0] === "-" ? "-" : "";
    const head = sign ? integer.slice(1) : integer;
    return `${sign}${head.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${
      fraction === undefined ? "" : `.${fraction}`
    }`;
  }

  public toJSON(): string {
    return this.toString();
  }

  public valueOf(): string {
    return this.toString();
  }
}

export const fixedconfig = {
  configure: FixedPrecision.configure.bind(FixedPrecision),
};
