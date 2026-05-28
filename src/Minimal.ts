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

const powerOfTen = (n: number): bigint => 10n ** BigInt(n);

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

function context(places: number, roundingMode: RoundingMode): FPContext {
  return {
    places,
    roundingMode,
    SCALE: powerOfTen(places),
    SCALENUMBER: 10 ** places,
  };
}

function fromNumberWithCtx(value: number, ctx: FPContext): bigint {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error("Invalid number: value must be a finite number.");
  }

  const scaled = value * ctx.SCALENUMBER;
  if (Math.abs(scaled) <= Number.MAX_SAFE_INTEGER) {
    return BigInt(Math.trunc(scaled));
  }

  if (Number.isInteger(value)) return BigInt(value) * ctx.SCALE;

  const integer = Math.trunc(value);
  const fraction = BigInt(
    Math.trunc(Math.abs(value - integer) * ctx.SCALENUMBER),
  );
  const scaledInteger = BigInt(integer) * ctx.SCALE;
  return value < 0 ? scaledInteger - fraction : scaledInteger + fraction;
}

function fromStringWithCtx(value: string, ctx: FPContext): bigint {
  let text = value.trim();
  if (/[eE]/.test(text)) return fromNumberWithCtx(Number(text), ctx);

  let sign = 1n;
  if (text[0] === "-" || text[0] === "+") {
    sign = text[0] === "-" ? -1n : 1n;
    text = text.slice(1);
  }

  const parts = text.split(".");
  if (parts.length > 2) throw new Error("Invalid value type: string");

  const integer = BigInt(parts[0] || "0") * ctx.SCALE;
  const fraction = BigInt(
    ((parts[1] ?? "") + "0".repeat(ctx.places)).slice(0, ctx.places) || "0",
  );
  return sign * (integer + fraction);
}

function toStringValue(value: bigint, ctx: FPContext): string {
  if (ctx.places === 0) return value.toString();

  const sign = value < 0n ? "-" : "";
  const text = (value < 0n ? -value : value)
    .toString()
    .padStart(ctx.places + 1, "0");
  return `${sign}${text.slice(0, -ctx.places)}.${text.slice(-ctx.places)}`;
}

function roundQuotient(
  value: bigint,
  factor: bigint,
  rm: RoundingMode,
): bigint {
  const quotient = value / factor;
  const remainder = value - quotient * factor;
  if (remainder === 0n || rm === 1) return quotient;

  const positive = value > 0n;
  if (rm === 0) return awayFromZero(quotient, positive);
  if (rm === 2) return positive ? quotient + 1n : quotient;
  if (rm === 3) return positive ? quotient : quotient - 1n;
  if (rm === 4 || rm === 5 || rm === 6 || rm === 7 || rm === 8) {
    return roundHalf(quotient, remainder, factor, positive, rm);
  }
  throw new Error(`Rounding mode ${rm} is not supported.`);
}

function awayFromZero(quotient: bigint, positive: boolean): bigint {
  return positive ? quotient + 1n : quotient - 1n;
}

function roundHalf(
  quotient: bigint,
  remainder: bigint,
  factor: bigint,
  positive: boolean,
  rm: RoundingMode,
): bigint {
  const twice = (remainder < 0n ? -remainder : remainder) * 2n;
  if (rm === 6) return roundHalfEven(quotient, twice, factor, positive);
  if (rm === 7) return positive && twice >= factor ? quotient + 1n : quotient;
  if (rm === 8) return roundHalfFloor(quotient, twice, factor, positive);

  const shouldRound = rm === 4 ? twice >= factor : twice > factor;
  return shouldRound ? awayFromZero(quotient, positive) : quotient;
}

function roundHalfEven(
  quotient: bigint,
  twice: bigint,
  factor: bigint,
  positive: boolean,
): bigint {
  if (twice === factor) {
    return quotient % 2n === 0n ? quotient : awayFromZero(quotient, positive);
  }
  return twice > factor ? awayFromZero(quotient, positive) : quotient;
}

function roundHalfFloor(
  quotient: bigint,
  twice: bigint,
  factor: bigint,
  positive: boolean,
): bigint {
  if (positive) return twice > factor ? quotient + 1n : quotient;
  return twice >= factor ? quotient - 1n : quotient;
}

function gcd(left: bigint, right: bigint): bigint {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b > 0n) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a;
}

function limitFraction(
  numerator: bigint,
  denominator: bigint,
  maxDenominator: bigint,
): [bigint, bigint] {
  if (maxDenominator < 1n) {
    throw new Error("maxDen must be a positive integer");
  }
  if (denominator <= maxDenominator) return [numerator, denominator];

  const sign = numerator < 0n ? -1n : 1n;
  let n = numerator < 0n ? -numerator : numerator;
  let d = denominator;
  let prevN = 0n;
  let curN = 1n;
  let prevD = 1n;
  let curD = 0n;

  while (d !== 0n) {
    const q = n / d;
    const nextD = prevD + q * curD;
    if (nextD > maxDenominator) break;

    const nextN = prevN + q * curN;
    prevN = curN;
    curN = nextN;
    prevD = curD;
    curD = nextD;

    const remainder = n - q * d;
    n = d;
    d = remainder;
  }

  return [sign * curN, curD];
}

export default class FixedPrecision {
  private value: bigint;
  private readonly ctx: FPContext;
  private static defaultContext = context(8, 4);

  public static configure(config: FixedPrecisionConfig): void {
    const places = config.places ?? FixedPrecision.defaultContext.places;
    const roundingMode =
      config.roundingMode ?? FixedPrecision.defaultContext.roundingMode;

    assertPlaces(places, "Decimal places must be an integer between 0 and 20");
    assertRoundingMode(roundingMode);
    FixedPrecision.defaultContext = context(places, roundingMode);
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
    const ctx = context(config.places, roundingMode);
    return (value: FixedPrecisionValue) => new FixedPrecision(value, ctx);
  }

  public constructor(value: FixedPrecisionValue, ctx?: FPContext) {
    this.ctx = ctx ?? FixedPrecision.defaultContext;
    this.value = FixedPrecision.toScaled(value, this.ctx);
  }

  protected fromRaw(rawValue: bigint): FixedPrecision {
    // return new FixedPrecision(rawValue, this.ctx);
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

  private toIntegerValue(value: FixedPrecisionValue): bigint {
    const normalized =
      value instanceof FixedPrecision
        ? new FixedPrecision(value.toString(), this.ctx)
        : new FixedPrecision(value, this.ctx);
    return normalized.trunc().value / this.ctx.SCALE;
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
    return value instanceof FixedPrecision
      ? new FixedPrecision(value.toString())
      : new FixedPrecision(value);
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
    if (!Number.isInteger(exp)) throw new Error("Exponent must be an integer");
    if (exp === 0) return this.fromRaw(this.ctx.SCALE);
    if (this.value === 0n) {
      if (exp < 0) throw new Error("0 ** negative is undefined");
      return this.fromRaw(0n);
    }

    let power = Math.abs(exp);
    let base = this.value;
    let result = this.ctx.SCALE;
    while (power > 0) {
      if (power & 1) result = (result * base) / this.ctx.SCALE;
      base = (base * base) / this.ctx.SCALE;
      power >>= 1;
    }
    return exp < 0
      ? this.fromRaw((this.ctx.SCALE * this.ctx.SCALE) / result)
      : this.fromRaw(result);
  }

  public square(): FixedPrecision {
    return this.mul(this);
  }

  public cube(): FixedPrecision {
    return this.mul(this).mul(this);
  }

  public sqrt(): FixedPrecision {
    if (this.value < 0n) throw new Error("Square root of negative number");
    return new FixedPrecision(Math.sqrt(this.toNumber()), this.ctx);
  }

  public cqrt(): FixedPrecision {
    return new FixedPrecision(Math.cbrt(this.toNumber()), this.ctx);
  }

  public round(
    dp = this.ctx.places,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    if (!Number.isInteger(dp) || dp < 0 || dp > this.ctx.places) {
      throw new Error(
        `Decimal places (dp) must be between 0 and ${this.ctx.places}`,
      );
    }
    const factor = powerOfTen(this.ctx.places - dp);
    return this.fromRaw(roundQuotient(this.value, factor, rm) * factor);
  }

  public scale(
    newScale: number,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    assertPlaces(newScale, "newScale must be an integer between 0 and 20");
    const nextValue =
      newScale > this.ctx.places
        ? this.value * powerOfTen(newScale - this.ctx.places)
        : roundQuotient(this.value, powerOfTen(this.ctx.places - newScale), rm);
    return new FixedPrecision(
      nextValue,
      context(newScale, this.ctx.roundingMode),
    );
  }

  public prec(
    sd: number,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    if (!Number.isInteger(sd) || sd < 1 || sd >= 1e6) {
      throw new Error("Precision must be a positive integer");
    }
    if (this.value === 0n) return this.fromRaw(0n);

    const exponent =
      (this.value < 0n ? -this.value : this.value).toString().length - sd;
    if (exponent <= 0) return this.fromRaw(this.value);

    const factor = powerOfTen(exponent);
    return this.fromRaw(roundQuotient(this.value, factor, rm) * factor);
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
    const factor = powerOfTen(Math.abs(n));
    return this.fromRaw(n >= 0 ? this.value * factor : this.value / factor);
  }

  public toNumber(): number {
    return Number(this.value) / this.ctx.SCALENUMBER;
  }

  public toString(): string {
    return toStringValue(this.value, this.ctx);
  }

  public toFixed(places = 0, rm: RoundingMode = this.ctx.roundingMode): string {
    if (!Number.isInteger(places) || places < 0 || places > this.ctx.places) {
      throw new Error(`places must be between 0 and ${this.ctx.places}`);
    }

    const quotient = roundQuotient(
      this.value,
      powerOfTen(this.ctx.places - places),
      rm,
    );
    const divisor = powerOfTen(places);
    const sign = quotient < 0n ? "-" : "";
    const absValue = quotient < 0n ? -quotient : quotient;
    const integer = absValue / divisor;
    const fraction = (absValue % divisor).toString().padStart(places, "0");
    return places > 0 ? `${sign}${integer}.${fraction}` : `${sign}${integer}`;
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

  public toFraction(
    maxDen?: FixedPrecisionValue,
  ): [FixedPrecision, FixedPrecision] {
    const common = gcd(this.value, this.ctx.SCALE);
    let numerator = this.value / common;
    let denominator = this.ctx.SCALE / common;

    if (maxDen !== undefined) {
      [numerator, denominator] = limitFraction(
        numerator,
        denominator,
        this.toIntegerValue(maxDen),
      );
    }

    return [
      new FixedPrecision(numerator * this.ctx.SCALE, this.ctx),
      new FixedPrecision(denominator * this.ctx.SCALE, this.ctx),
    ];
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
