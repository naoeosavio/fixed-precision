import { power } from "./arithmetic/power";
import { makeContext } from "./core/context";
import { squareRoot } from "./geometry/sqrt";
import { fromNumberWithCtx, toNumberWithCtx } from "./numeric/number";
import { precisionValue } from "./numeric/precision";
import { roundValue, scaleValue } from "./numeric/rounding";
import { toStringWithCtx } from "./string/format";
import { fromStringWithCtx } from "./string/parse";
import { precisionPowerOfTen } from "./utils";

export type RoundingMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Comparison = -1 | 0 | 1;
export type FixedPrecisionValue = string | number | bigint | FixedPrecision;

type FPContext = {
  places: number;
  roundingMode: RoundingMode;
  SCALE: bigint;
  SCALENUMBER: number;
};

export interface FixedPrecisionConfig {
  places: number;
  roundingMode?: RoundingMode;
}
function assertPlaces(places: number, message: string): void {
  if (!Number.isInteger(places) || places < 0 || places > 20) {
    throw new Error(message);
  }
}

function assertRoundingMode(rm: number): asserts rm is RoundingMode {
  if (!Number.isInteger(rm) || rm < 0 || rm > 8) {
    throw new Error(
      "Invalid rounding mode. Must be 0, 1, 2, 3, 4, 5, 6, 7 or 8",
    );
  }
}

export default class FixedPrecision {
  private value: bigint;
  private readonly ctx: FPContext;
  private static defaultContext = makeContext(8, 4);

  public static configure(config: FixedPrecisionConfig): void {
    const places = config.places ?? FixedPrecision.defaultContext.places;
    const roundingMode =
      config.roundingMode ?? FixedPrecision.defaultContext.roundingMode;

    assertPlaces(places, "Decimal places must be an integer between 0 and 20");
    assertRoundingMode(roundingMode);
    FixedPrecision.defaultContext = makeContext(places, roundingMode);
  }

  public static create(
    config: FixedPrecisionConfig,
  ): (val: FixedPrecisionValue) => FixedPrecision {
    assertPlaces(
      config.places,
      "Decimal places must be an integer between 0 and 20",
    );
    const roundingMode = config.roundingMode ?? 4;
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
    if (value instanceof FixedPrecision) return value.value;
    if (typeof value === "bigint") return value;
    if (typeof value === "number") return fromNumberWithCtx(value, ctx);
    if (typeof value === "string") return fromStringWithCtx(value, ctx);
    throw new Error(`Invalid value type: ${typeof value}`);
  }

  private toScaledValue(value: FixedPrecisionValue): bigint {
    return FixedPrecision.toScaled(value, this.ctx);
  }

  private coerce(value: FixedPrecisionValue): FixedPrecision {
    if (value instanceof FixedPrecision) {
      if (this.ctx.places !== value.ctx.places) {
        throw new Error("Cannot operate on different precisions");
      }
      return value;
    }
    return new FixedPrecision(value, this.ctx);
  }

  public static random(decimalPlaces?: number): FixedPrecision {
    const places = decimalPlaces ?? FixedPrecision.defaultContext.places;
    const max = 10 ** places;
    return new FixedPrecision(
      `0.${Math.floor(Math.random() * max)
        .toString()
        .padStart(places, "0")}`,
    );
  }

  private static normalized(value: FixedPrecisionValue): FixedPrecision {
    if (value instanceof FixedPrecision) {
      const ctx = FixedPrecision.defaultContext;
      if (
        value.ctx.places === ctx.places &&
        value.ctx.roundingMode === ctx.roundingMode
      ) {
        return value;
      }
      return value.scale(ctx.places, ctx.roundingMode);
    } else {
      return new FixedPrecision(value);
    }
  }

  public static min(
    value: FixedPrecisionValue | FixedPrecisionValue[],
    ...values: FixedPrecisionValue[]
  ): FixedPrecision {
    const items = Array.isArray(value) ? value : [value, ...values];
    const first = items[0];
    if (first === undefined) {
      throw new Error("FixedPrecision.min requires at least one argument");
    }

    let result = FixedPrecision.normalized(first);
    for (const item of items.slice(1)) {
      const next = FixedPrecision.normalized(item);
      if (next.lt(result)) result = next;
    }
    return result;
  }

  public static max(
    value: FixedPrecisionValue | FixedPrecisionValue[],
    ...values: FixedPrecisionValue[]
  ): FixedPrecision {
    const items = Array.isArray(value) ? value : [value, ...values];
    const first = items[0];
    if (first === undefined) {
      throw new Error("FixedPrecision.max requires at least one argument");
    }

    let result = FixedPrecision.normalized(first);
    for (const item of items.slice(1)) {
      const next = FixedPrecision.normalized(item);
      if (next.gt(result)) result = next;
    }
    return result;
  }

  public static sum(
    value: FixedPrecisionValue | FixedPrecisionValue[],
    ...values: FixedPrecisionValue[]
  ): FixedPrecision {
    const items = Array.isArray(value) ? value : [value, ...values];
    const first = items[0];
    if (first === undefined) return new FixedPrecision(0n);

    const ctx = FixedPrecision.normalized(first).ctx;
    let total = 0n;
    for (const item of items) {
      total += FixedPrecision.normalized(item).value;
    }
    return new FixedPrecision(total, ctx);
  }

  public abs(): FixedPrecision {
    return this.fromRaw(this.value < 0n ? -this.value : this.value);
  }

  public cmp(other: FixedPrecisionValue): Comparison {
    const value = this.coerce(other).value;
    return this.value < value ? -1 : this.value > value ? 1 : 0;
  }

  public eq(other: FixedPrecisionValue): boolean {
    return this.value === this.coerce(other).value;
  }

  public gt(other: FixedPrecisionValue): boolean {
    return this.value > this.coerce(other).value;
  }

  public gte(other: FixedPrecisionValue): boolean {
    return this.value >= this.coerce(other).value;
  }

  public lt(other: FixedPrecisionValue): boolean {
    return this.value < this.coerce(other).value;
  }

  public lte(other: FixedPrecisionValue): boolean {
    return this.value <= this.coerce(other).value;
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

  public product(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value * this.toScaledValue(other));
  }

  public div(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(
      (this.value * this.ctx.SCALE) / this.coerce(other).value,
    );
  }

  public idiv(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(
      (this.value / this.coerce(other).value) * this.ctx.SCALE,
    );
  }

  public fraction(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value / this.toScaledValue(other));
  }

  public mod(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(
      (this.value * this.ctx.SCALE) % this.coerce(other).value,
    );
  }

  public leftover(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value % this.toScaledValue(other));
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
    return this.fromRaw(squareRoot(this.value, this.ctx.SCALE));
  }

  public round(
    dp = this.ctx.places,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    return this.fromRaw(roundValue(this.value, dp, rm, this.ctx));
  }

  public scale(
    newScale: number,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    const nextValue = scaleValue(this.value, newScale, rm, this.ctx);
    const nextCtx = makeContext(newScale, this.ctx.roundingMode);
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
      return toNumberWithCtx(this.value, this.ctx);
    }

    const scaled = this.scale(places);
    return toNumberWithCtx(scaled.value, scaled.ctx);
  }

  public toString(): string {
    return toStringWithCtx(this.value, this.ctx);
  }

  public toFixed(places = 0, rm: RoundingMode = this.ctx.roundingMode): string {
    return this.scale(places, rm).toString();
  }

  public toExponential(dp = this.ctx.places, rm?: RoundingMode): string {
    const rounded = dp <= this.ctx.places ? this.round(dp, rm) : this;
    return rounded.toNumber().toExponential(dp);
  }

  public toPrecision(sd: number, rm?: RoundingMode): string {
    if (sd >= 1e6) throw new Error("Invalid precision");
    return this.prec(sd, rm)
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
