import { precision_value } from "./arithmetic/precision";
import {
  configureDefaultContext,
  fromContextValue,
  getDefaultContext,
  getFunction,
  isFixedPrecisionLike,
  normalizeTo,
  resolveContext,
  toScaled,
} from "./core/value";
import {
  compareValues,
  equalsValue,
  greaterThanOrEqualValue,
  greaterThanValue,
  lessThanOrEqualValue,
  lessThanValue,
} from "./relational";
import { to_string_with_ctx } from "./string/toString";
import type {
  Comparison,
  FixedPrecisionConfig,
  FixedPrecisionLike,
  FixedPrecisionValue,
  FPContext,
  RoundingMode,
} from "./types";
import { FP_BRAND } from "./types";

export type {
  Comparison,
  FixedPrecisionConfig,
  FixedPrecisionLike,
  FixedPrecisionValue,
  FPContext,
  RoundingMode,
} from "./types";

export default class FixedPrecision implements FixedPrecisionLike {
  private value: bigint = 0n;
  private readonly ctx!: FPContext;

  readonly [FP_BRAND] = true as const;

  public static configure(config: FixedPrecisionConfig): void {
    configureDefaultContext(config);
  }

  constructor(value: FixedPrecisionValue, ctx?: FPContext) {
    this.ctx = ctx ?? getDefaultContext();
    this.value = FixedPrecision.toScaled(value, this.ctx);
  }

  public static create(
    config: FixedPrecisionConfig,
  ): (val: FixedPrecisionValue) => FixedPrecision {
    return getFunction("createFactory")(config) as (
      val: FixedPrecisionValue,
    ) => FixedPrecision;
  }

  public static isFixedPrecision(value: unknown): value is FixedPrecision {
    return isFixedPrecisionLike(value);
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
    if (isFixedPrecisionLike(value)) {
      const valueCtx = value.context();
      if (
        this.ctx.places !== valueCtx.places ||
        this.ctx.roundingMode !== valueCtx.roundingMode
      ) {
        throw new Error("Cannot operate on different precisions");
      } else {
        return value as FixedPrecision;
      }
    } else {
      return new FixedPrecision(value, this.ctx);
    }
  }

  public static toScaled(value: FixedPrecisionValue, ctx: FPContext): bigint {
    return toScaled(value, ctx);
  }

  private toScaledValue(value: FixedPrecisionValue): bigint {
    return FixedPrecision.toScaled(value, this.ctx);
  }

  public context(): FPContext {
    return this.ctx;
  }

  public toNumber(places?: number): number {
    return getFunction("toNumber")(this, places);
  }

  public toString(trimZeros = true): string {
    return to_string_with_ctx(this.value, this.ctx, trimZeros);
  }

  public abs(): FixedPrecision {
    return getFunction("abs")(this) as FixedPrecision;
  }

  public cmp(other: FixedPrecisionValue): Comparison {
    return getFunction("compare")(this, this.coerce(other));
  }

  public eq(other: FixedPrecisionValue): boolean {
    return getFunction("equals")(this, this.coerce(other));
  }

  public gt(other: FixedPrecisionValue): boolean {
    return getFunction("greaterThan")(this, this.coerce(other));
  }

  public gte(other: FixedPrecisionValue): boolean {
    return getFunction("greaterThanOrEqual")(this, this.coerce(other));
  }

  public lt(other: FixedPrecisionValue): boolean {
    return getFunction("lessThan")(this, this.coerce(other));
  }

  public lte(other: FixedPrecisionValue): boolean {
    return getFunction("lessThanOrEqual")(this, this.coerce(other));
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
    return getFunction("isZero")(this);
  }

  public isPositive(): boolean {
    return getFunction("isPositive")(this);
  }

  public isNegative(): boolean {
    return getFunction("isNegative")(this);
  }

  public not(): boolean {
    return getFunction("logicalNot")(this);
  }

  public and(other: FixedPrecisionValue): boolean {
    return getFunction("logicalAnd")(this, this.coerce(other));
  }

  public or(other: FixedPrecisionValue): boolean {
    return getFunction("logicalOr")(this, this.coerce(other));
  }

  public xor(other: FixedPrecisionValue): boolean {
    return getFunction("logicalXor")(this, this.coerce(other));
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
    return getFunction("precision")(this, includeZeros);
  }

  public sd(includeZeros = false): number {
    return this.precision(includeZeros);
  }

  public add(other: FixedPrecisionValue): FixedPrecision {
    return getFunction("add")(this, this.coerce(other)) as FixedPrecision;
  }

  public plus(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value + this.toScaledValue(other));
  }

  public sub(other: FixedPrecisionValue): FixedPrecision {
    return getFunction("subtract")(this, this.coerce(other)) as FixedPrecision;
  }

  public minus(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value - this.toScaledValue(other));
  }

  public mul(other: FixedPrecisionValue): FixedPrecision {
    return getFunction("multiply")(this, this.coerce(other)) as FixedPrecision;
  }

  public times(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value * this.toScaledValue(other));
  }

  public div(other: FixedPrecisionValue): FixedPrecision {
    return getFunction("divide")(this, this.coerce(other)) as FixedPrecision;
  }

  public ratio(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value / this.toScaledValue(other));
  }

  public mod(other: FixedPrecisionValue): FixedPrecision {
    return getFunction("mod")(this, this.coerce(other)) as FixedPrecision;
  }

  public rem(other: FixedPrecisionValue): FixedPrecision {
    return this.fromRaw(this.value % this.toScaledValue(other));
  }

  public idiv(other: FixedPrecisionValue): FixedPrecision {
    return getFunction("idiv")(this, this.coerce(other)) as FixedPrecision;
  }

  public divmod(other: FixedPrecisionValue): {
    quotient: FixedPrecision;
    remainder: FixedPrecision;
  } {
    return getFunction("divmod")(this, this.coerce(other)) as {
      quotient: FixedPrecision;
      remainder: FixedPrecision;
    };
  }

  public idivmod(other: FixedPrecisionValue): {
    quotient: FixedPrecision;
    remainder: FixedPrecision;
  } {
    return getFunction("idivmod")(this, this.coerce(other)) as {
      quotient: FixedPrecision;
      remainder: FixedPrecision;
    };
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
    return getFunction("clamp")(
      this,
      this.coerce(min),
      this.coerce(max),
    ) as FixedPrecision;
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
    return getFunction("toNearest")(
      this,
      this.coerce(increment),
      rm,
    ) as FixedPrecision;
  }

  public bitAnd(other: FixedPrecisionValue): FixedPrecision {
    return getFunction("bitAnd")(this, this.coerce(other)) as FixedPrecision;
  }

  public bitOr(other: FixedPrecisionValue): FixedPrecision {
    return getFunction("bitOr")(this, this.coerce(other)) as FixedPrecision;
  }

  public bitXor(other: FixedPrecisionValue): FixedPrecision {
    return getFunction("bitXor")(this, this.coerce(other)) as FixedPrecision;
  }

  public bitNot(): FixedPrecision {
    return getFunction("bitNot")(this) as FixedPrecision;
  }

  public leftShift(n: number): FixedPrecision {
    return getFunction("leftShift")(this, n) as FixedPrecision;
  }

  public rightArithShift(n: number): FixedPrecision {
    return getFunction("rightArithShift")(this, n) as FixedPrecision;
  }

  public neg(): FixedPrecision {
    return getFunction("neg")(this) as FixedPrecision;
  }

  public pow(exp: number): FixedPrecision {
    return getFunction("pow")(this, exp) as FixedPrecision;
  }

  public square(): FixedPrecision {
    return getFunction("square")(this) as FixedPrecision;
  }

  public cube(): FixedPrecision {
    return getFunction("cube")(this) as FixedPrecision;
  }

  public sqrt(): FixedPrecision {
    return getFunction("sqrt")(this) as FixedPrecision;
  }

  public cbrt(): FixedPrecision {
    return getFunction("cbrt")(this) as FixedPrecision;
  }

  public cubeRoot(): FixedPrecision {
    return this.cbrt();
  }

  public ln(): FixedPrecision {
    return getFunction("naturalLog")(this) as FixedPrecision;
  }

  public log(base?: FixedPrecisionValue): FixedPrecision {
    return getFunction("log")(
      this,
      base === undefined ? undefined : this.coerce(base),
    ) as FixedPrecision;
  }

  public log10(): FixedPrecision {
    return getFunction("log10")(this) as FixedPrecision;
  }

  public log2(): FixedPrecision {
    return getFunction("log2")(this) as FixedPrecision;
  }

  public exp(): FixedPrecision {
    return getFunction("exp")(this) as FixedPrecision;
  }

  public sin(): FixedPrecision {
    return getFunction("sin")(this) as FixedPrecision;
  }

  public cos(): FixedPrecision {
    return getFunction("cos")(this) as FixedPrecision;
  }

  public tan(): FixedPrecision {
    return getFunction("tan")(this) as FixedPrecision;
  }

  public sec(): FixedPrecision {
    return getFunction("sec")(this) as FixedPrecision;
  }

  public csc(): FixedPrecision {
    return getFunction("csc")(this) as FixedPrecision;
  }

  public cot(): FixedPrecision {
    return getFunction("cot")(this) as FixedPrecision;
  }

  public asin(): FixedPrecision {
    return getFunction("asin")(this) as FixedPrecision;
  }

  public acos(): FixedPrecision {
    return getFunction("acos")(this) as FixedPrecision;
  }

  public atan(): FixedPrecision {
    return getFunction("atan")(this) as FixedPrecision;
  }

  public atan2(x: FixedPrecisionValue): FixedPrecision {
    return getFunction("atan2")(this, this.coerce(x)) as FixedPrecision;
  }

  public acot(): FixedPrecision {
    return getFunction("acot")(this) as FixedPrecision;
  }

  public asec(): FixedPrecision {
    return getFunction("asec")(this) as FixedPrecision;
  }

  public acsc(): FixedPrecision {
    return getFunction("acsc")(this) as FixedPrecision;
  }

  public sinh(): FixedPrecision {
    return getFunction("sinh")(this) as FixedPrecision;
  }

  public cosh(): FixedPrecision {
    return getFunction("cosh")(this) as FixedPrecision;
  }

  public tanh(): FixedPrecision {
    return getFunction("tanh")(this) as FixedPrecision;
  }

  public sech(): FixedPrecision {
    return getFunction("sech")(this) as FixedPrecision;
  }

  public csch(): FixedPrecision {
    return getFunction("csch")(this) as FixedPrecision;
  }

  public coth(): FixedPrecision {
    return getFunction("coth")(this) as FixedPrecision;
  }

  public asinh(): FixedPrecision {
    return getFunction("asinh")(this) as FixedPrecision;
  }

  public acosh(): FixedPrecision {
    return getFunction("acosh")(this) as FixedPrecision;
  }

  public atanh(): FixedPrecision {
    return getFunction("atanh")(this) as FixedPrecision;
  }

  public asech(): FixedPrecision {
    return getFunction("asech")(this) as FixedPrecision;
  }

  public acsch(): FixedPrecision {
    return getFunction("acsch")(this) as FixedPrecision;
  }

  public acoth(): FixedPrecision {
    return getFunction("acoth")(this) as FixedPrecision;
  }

  public num(): FixedPrecision {
    return getFunction("getNumerator")(this) as FixedPrecision;
  }

  public den(): FixedPrecision {
    return getFunction("getDenominator")(this) as FixedPrecision;
  }

  public fraction(
    maxDen?: FixedPrecisionValue,
  ): [FixedPrecision, FixedPrecision] {
    return getFunction("fraction")(
      this,
      maxDen === undefined ? undefined : this.coerce(maxDen),
    ) as [FixedPrecision, FixedPrecision];
  }

  public round(
    dp: number = this.ctx.places,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    return getFunction("round")(this, dp, rm) as FixedPrecision;
  }

  public scale(
    newScale: number,
    rm: RoundingMode = this.ctx.roundingMode,
  ): FixedPrecision {
    return getFunction("scale")(this, newScale, rm) as FixedPrecision;
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
    return getFunction("ceil")(this) as FixedPrecision;
  }

  public floor(): FixedPrecision {
    return getFunction("floor")(this) as FixedPrecision;
  }

  public trunc(): FixedPrecision {
    return getFunction("trunc")(this) as FixedPrecision;
  }

  public shiftedBy(n: number): FixedPrecision {
    return getFunction("shiftedBy")(this, n) as FixedPrecision;
  }

  public static sign(value: FixedPrecisionValue): number {
    return getFunction("sign")(value);
  }

  public static not(value: FixedPrecisionValue): boolean {
    return getFunction("logicalNot")(value);
  }

  public static and(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): boolean {
    return getFunction("logicalAnd")(left, right);
  }

  public static or(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): boolean {
    return getFunction("logicalOr")(left, right);
  }

  public static xor(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): boolean {
    return getFunction("logicalXor")(left, right);
  }

  public static fromContextValue(
    value: FixedPrecisionValue,
    operation: (value: bigint, ctx: FPContext) => bigint,
  ): FixedPrecision {
    return fromContextValue(value, operation) as FixedPrecision;
  }

  public static PI(): FixedPrecision {
    return getFunction("pi")() as FixedPrecision;
  }

  public static e(): FixedPrecision {
    return getFunction("e")() as FixedPrecision;
  }

  public static exp(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("exp")(value) as FixedPrecision;
  }

  public static abs(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("abs")(value) as FixedPrecision;
  }

  public static add(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    return getFunction("add")(left, right) as FixedPrecision;
  }

  public static sub(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    return getFunction("subtract")(left, right) as FixedPrecision;
  }

  public static mul(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    return getFunction("multiply")(left, right) as FixedPrecision;
  }

  public static div(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    return getFunction("divide")(left, right) as FixedPrecision;
  }

  public static mod(
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ): FixedPrecision {
    return getFunction("mod")(left, right) as FixedPrecision;
  }

  public static pow(value: FixedPrecisionValue, exp: number): FixedPrecision {
    return getFunction("pow")(value, exp) as FixedPrecision;
  }

  public static ceil(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("ceil")(value) as FixedPrecision;
  }

  public static floor(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("floor")(value) as FixedPrecision;
  }

  public static trunc(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("trunc")(value) as FixedPrecision;
  }

  public static round(
    value: FixedPrecisionValue,
    dp?: number,
    rm?: RoundingMode,
  ): FixedPrecision {
    return getFunction("round")(value, dp, rm) as FixedPrecision;
  }

  public static ln(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("naturalLog")(value) as FixedPrecision;
  }

  public static log(
    value: FixedPrecisionValue,
    base?: FixedPrecisionValue,
  ): FixedPrecision {
    return getFunction("log")(value, base) as FixedPrecision;
  }

  public static log2(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("log2")(value) as FixedPrecision;
  }

  public static log10(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("log10")(value) as FixedPrecision;
  }

  public static clamp(
    value: FixedPrecisionValue,
    min: FixedPrecisionValue,
    max: FixedPrecisionValue,
  ): FixedPrecision {
    return getFunction("clamp")(value, min, max) as FixedPrecision;
  }

  public static square(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("square")(value) as FixedPrecision;
  }

  public static cube(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("cube")(value) as FixedPrecision;
  }

  public static sqrt(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("sqrt")(value) as FixedPrecision;
  }

  public static cbrt(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("cbrt")(value) as FixedPrecision;
  }

  public static sin(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("sin")(value) as FixedPrecision;
  }

  public static cos(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("cos")(value) as FixedPrecision;
  }

  public static tan(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("tan")(value) as FixedPrecision;
  }

  public static sec(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("sec")(value) as FixedPrecision;
  }

  public static csc(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("csc")(value) as FixedPrecision;
  }

  public static cot(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("cot")(value) as FixedPrecision;
  }

  public static asin(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("asin")(value) as FixedPrecision;
  }

  public static acos(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("acos")(value) as FixedPrecision;
  }

  public static atan(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("atan")(value) as FixedPrecision;
  }

  public static atan2(
    y: FixedPrecisionValue,
    x: FixedPrecisionValue,
  ): FixedPrecision {
    return getFunction("atan2")(y, x) as FixedPrecision;
  }

  public static acot(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("acot")(value) as FixedPrecision;
  }

  public static asec(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("asec")(value) as FixedPrecision;
  }

  public static acsc(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("acsc")(value) as FixedPrecision;
  }

  public static sinh(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("sinh")(value) as FixedPrecision;
  }

  public static cosh(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("cosh")(value) as FixedPrecision;
  }

  public static tanh(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("tanh")(value) as FixedPrecision;
  }

  public static sech(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("sech")(value) as FixedPrecision;
  }

  public static csch(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("csch")(value) as FixedPrecision;
  }

  public static coth(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("coth")(value) as FixedPrecision;
  }

  public static asinh(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("asinh")(value) as FixedPrecision;
  }

  public static acosh(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("acosh")(value) as FixedPrecision;
  }

  public static atanh(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("atanh")(value) as FixedPrecision;
  }

  public static asech(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("asech")(value) as FixedPrecision;
  }

  public static acsch(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("acsch")(value) as FixedPrecision;
  }

  public static acoth(value: FixedPrecisionValue): FixedPrecision {
    return getFunction("acoth")(value) as FixedPrecision;
  }

  public static phi(): FixedPrecision {
    return getFunction("phi")() as FixedPrecision;
  }

  public static sqrt2(): FixedPrecision {
    return getFunction("sqrt2")() as FixedPrecision;
  }

  public static random(decimalPlaces?: number): FixedPrecision {
    return getFunction("random")(decimalPlaces) as FixedPrecision;
  }

  public static resolveContext(values: FixedPrecisionValue[]): FPContext {
    return resolveContext(values);
  }

  public static normalizeTo(
    v: FixedPrecisionValue,
    ctx: FPContext,
  ): FixedPrecision {
    return normalizeTo(v, ctx) as FixedPrecision;
  }

  public static dot(
    a: FixedPrecisionValue[],
    b: FixedPrecisionValue[],
  ): FixedPrecision {
    return getFunction("dot")(a, b) as FixedPrecision;
  }

  public static cross(
    a: FixedPrecisionValue[],
    b: FixedPrecisionValue[],
  ): FixedPrecision[] {
    return getFunction("cross")(a, b) as FixedPrecision[];
  }

  public static min(
    val: FixedPrecisionValue | FixedPrecisionValue[],
    ...vals: FixedPrecisionValue[]
  ): FixedPrecision {
    return getFunction("min")(val, ...vals) as FixedPrecision;
  }

  public static max(
    val: FixedPrecisionValue | FixedPrecisionValue[],
    ...vals: FixedPrecisionValue[]
  ): FixedPrecision {
    return getFunction("max")(val, ...vals) as FixedPrecision;
  }

  public static sum(
    val: FixedPrecisionValue | FixedPrecisionValue[],
    ...vals: FixedPrecisionValue[]
  ): FixedPrecision {
    return getFunction("sum")(val, ...vals) as FixedPrecision;
  }

  public static hypot(
    val?: FixedPrecisionValue | FixedPrecisionValue[],
    ...vals: FixedPrecisionValue[]
  ): FixedPrecision {
    return getFunction("hypot")(val, ...vals) as FixedPrecision;
  }

  public static factorial(n: number | FixedPrecision): FixedPrecision {
    return getFunction("factorial")(n) as FixedPrecision;
  }

  public static permutations(
    n: number | FixedPrecision,
    k: number | FixedPrecision,
  ): FixedPrecision {
    return getFunction("permutations")(n, k) as FixedPrecision;
  }

  public static combinations(
    n: number | FixedPrecision,
    k: number | FixedPrecision,
  ): FixedPrecision {
    return getFunction("combinations")(n, k) as FixedPrecision;
  }

  public toExponential(dp?: number, rm?: RoundingMode): string {
    return getFunction("toExponential")(this, dp, rm);
  }

  public toPrecision(sd: number, rm?: RoundingMode): string {
    return getFunction("toPrecision")(this, sd, rm);
  }

  public toFixed(places = 0, rm?: RoundingMode): string {
    return getFunction("toFixed")(this, places, rm);
  }

  public toBinary(sd?: number, rm?: RoundingMode): string {
    return getFunction("toBase")(this, 2, sd, rm);
  }

  public toOctal(sd?: number, rm?: RoundingMode): string {
    return getFunction("toBase")(this, 8, sd, rm);
  }

  public toHex(sd?: number, rm?: RoundingMode): string {
    return getFunction("toBase")(this, 16, sd, rm);
  }

  public toHexadecimal(sd?: number, rm?: RoundingMode): string {
    return this.toHex(sd, rm);
  }

  public toBase(base: 2 | 8 | 16, sd?: number, rm?: RoundingMode): string {
    return getFunction("toBase")(this, base, sd, rm);
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
