import { scale_value } from "../arithmetic/scale";
import FixedPrecision from "../FixedPrecision";
import { from_number_with_ctx } from "../numeric/fromNumber";
import { from_string_with_ctx } from "../string/fromString";
import type {
  Comparison,
  FixedPrecisionConfig,
  FixedPrecisionLike,
  FixedPrecisionValue,
  FPContext,
  RoundingMode,
} from "../types";
import { FP_BRAND } from "../types";
import { configureContext, makeContext } from "./context";

export type FunctionTable = {
  abs: (value: FixedPrecisionValue) => FixedPrecisionLike;
  add: (
    value: FixedPrecisionValue,
    amount: FixedPrecisionValue,
  ) => FixedPrecisionLike;
  atan2: (y: FixedPrecisionValue, x: FixedPrecisionValue) => FixedPrecisionLike;
  bitAnd: (
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ) => FixedPrecisionLike;
  bitNot: (value: FixedPrecisionValue) => FixedPrecisionLike;
  bitOr: (
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ) => FixedPrecisionLike;
  bitXor: (
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ) => FixedPrecisionLike;
  cbrt: (value: FixedPrecisionValue) => FixedPrecisionLike;
  ceil: (value: FixedPrecisionValue) => FixedPrecisionLike;
  clamp: (
    value: FixedPrecisionValue,
    min: FixedPrecisionValue,
    max: FixedPrecisionValue,
  ) => FixedPrecisionLike;
  combinations: (
    n: number | FixedPrecisionLike,
    k: number | FixedPrecisionLike,
  ) => FixedPrecisionLike;
  compare: (
    value: FixedPrecisionValue,
    other: FixedPrecisionValue,
  ) => Comparison;
  cos: (value: FixedPrecisionValue) => FixedPrecisionLike;
  cosh: (value: FixedPrecisionValue) => FixedPrecisionLike;
  cot: (value: FixedPrecisionValue) => FixedPrecisionLike;
  coth: (value: FixedPrecisionValue) => FixedPrecisionLike;
  createFactory: (
    config: FixedPrecisionConfig,
  ) => (value: FixedPrecisionValue) => FixedPrecisionLike;
  cross: (
    a: FixedPrecisionValue[],
    b: FixedPrecisionValue[],
  ) => FixedPrecisionLike[];
  csc: (value: FixedPrecisionValue) => FixedPrecisionLike;
  csch: (value: FixedPrecisionValue) => FixedPrecisionLike;
  cube: (value: FixedPrecisionValue) => FixedPrecisionLike;
  divide: (
    value: FixedPrecisionValue,
    amount: FixedPrecisionValue,
  ) => FixedPrecisionLike;
  divmod: (
    value: FixedPrecisionValue,
    other: FixedPrecisionValue,
  ) => { quotient: FixedPrecisionLike; remainder: FixedPrecisionLike };
  dot: (
    a: FixedPrecisionValue[],
    b: FixedPrecisionValue[],
  ) => FixedPrecisionLike;
  e: () => FixedPrecisionLike;
  equals: (left: FixedPrecisionValue, right: FixedPrecisionValue) => boolean;
  exp: (value: FixedPrecisionValue) => FixedPrecisionLike;
  factorial: (n: number | FixedPrecisionLike) => FixedPrecisionLike;
  floor: (value: FixedPrecisionValue) => FixedPrecisionLike;
  fraction: (
    value: FixedPrecisionValue,
    maxDen?: FixedPrecisionValue,
  ) => [FixedPrecisionLike, FixedPrecisionLike];
  getDenominator: (value: FixedPrecisionValue) => FixedPrecisionLike;
  getNumerator: (value: FixedPrecisionValue) => FixedPrecisionLike;
  greaterThan: (
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ) => boolean;
  greaterThanOrEqual: (
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ) => boolean;
  hypot: (
    value?: FixedPrecisionValue | FixedPrecisionValue[],
    ...values: FixedPrecisionValue[]
  ) => FixedPrecisionLike;
  idiv: (
    value: FixedPrecisionValue,
    other: FixedPrecisionValue,
  ) => FixedPrecisionLike;
  idivmod: (
    value: FixedPrecisionValue,
    other: FixedPrecisionValue,
  ) => { quotient: FixedPrecisionLike; remainder: FixedPrecisionLike };
  isNegative: (value: FixedPrecisionValue) => boolean;
  isPositive: (value: FixedPrecisionValue) => boolean;
  isZero: (value: FixedPrecisionValue) => boolean;
  leftShift: (value: FixedPrecisionValue, n: number) => FixedPrecisionLike;
  lessThan: (left: FixedPrecisionValue, right: FixedPrecisionValue) => boolean;
  lessThanOrEqual: (
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ) => boolean;
  log: (
    value: FixedPrecisionValue,
    base?: FixedPrecisionValue,
  ) => FixedPrecisionLike;
  log2: (value: FixedPrecisionValue) => FixedPrecisionLike;
  log10: (value: FixedPrecisionValue) => FixedPrecisionLike;
  logicalAnd: (
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ) => boolean;
  logicalNot: (value: FixedPrecisionValue) => boolean;
  logicalOr: (left: FixedPrecisionValue, right: FixedPrecisionValue) => boolean;
  logicalXor: (
    left: FixedPrecisionValue,
    right: FixedPrecisionValue,
  ) => boolean;
  max: (
    value: FixedPrecisionValue | FixedPrecisionValue[],
    ...values: FixedPrecisionValue[]
  ) => FixedPrecisionLike;
  min: (
    value: FixedPrecisionValue | FixedPrecisionValue[],
    ...values: FixedPrecisionValue[]
  ) => FixedPrecisionLike;
  mod: (
    value: FixedPrecisionValue,
    amount: FixedPrecisionValue,
  ) => FixedPrecisionLike;
  multiply: (
    value: FixedPrecisionValue,
    amount: FixedPrecisionValue,
  ) => FixedPrecisionLike;
  naturalLog: (value: FixedPrecisionValue) => FixedPrecisionLike;
  neg: (value: FixedPrecisionValue) => FixedPrecisionLike;
  permutations: (
    n: number | FixedPrecisionLike,
    k: number | FixedPrecisionLike,
  ) => FixedPrecisionLike;
  phi: () => FixedPrecisionLike;
  pi: () => FixedPrecisionLike;
  pow: (value: FixedPrecisionValue, exp: number) => FixedPrecisionLike;
  precision: (value: FixedPrecisionValue, includeZeros?: boolean) => number;
  random: (decimalPlaces?: number) => FixedPrecisionLike;
  rightArithShift: (
    value: FixedPrecisionValue,
    n: number,
  ) => FixedPrecisionLike;
  round: (
    value: FixedPrecisionValue,
    dp?: number,
    rm?: RoundingMode,
  ) => FixedPrecisionLike;
  scale: (
    value: FixedPrecisionValue,
    places: number,
    rm?: RoundingMode,
  ) => FixedPrecisionLike;
  sec: (value: FixedPrecisionValue) => FixedPrecisionLike;
  sech: (value: FixedPrecisionValue) => FixedPrecisionLike;
  shiftedBy: (value: FixedPrecisionValue, n: number) => FixedPrecisionLike;
  sign: (value: FixedPrecisionValue) => number;
  sin: (value: FixedPrecisionValue) => FixedPrecisionLike;
  sinh: (value: FixedPrecisionValue) => FixedPrecisionLike;
  sqrt: (value: FixedPrecisionValue) => FixedPrecisionLike;
  sqrt2: () => FixedPrecisionLike;
  square: (value: FixedPrecisionValue) => FixedPrecisionLike;
  subtract: (
    value: FixedPrecisionValue,
    amount: FixedPrecisionValue,
  ) => FixedPrecisionLike;
  sum: (
    value: FixedPrecisionValue | FixedPrecisionValue[],
    ...values: FixedPrecisionValue[]
  ) => FixedPrecisionLike;
  tan: (value: FixedPrecisionValue) => FixedPrecisionLike;
  tanh: (value: FixedPrecisionValue) => FixedPrecisionLike;
  toBase: (
    value: FixedPrecisionValue,
    base: 2 | 8 | 16,
    sd?: number,
    rm?: RoundingMode,
  ) => string;
  toExponential: (
    value: FixedPrecisionValue,
    dp?: number,
    rm?: RoundingMode,
  ) => string;
  toFixed: (
    value: FixedPrecisionValue,
    places?: number,
    rm?: RoundingMode,
  ) => string;
  toNearest: (
    value: FixedPrecisionValue,
    increment: FixedPrecisionValue,
    rm?: RoundingMode,
  ) => FixedPrecisionLike;
  toNumber: (value: FixedPrecisionValue, places?: number) => number;
  toPrecision: (
    value: FixedPrecisionValue,
    sd: number,
    rm?: RoundingMode,
  ) => string;
  toString: (value: FixedPrecisionValue, trimZeros?: boolean) => string;
  trunc: (value: FixedPrecisionValue) => FixedPrecisionLike;
  acos: (value: FixedPrecisionValue) => FixedPrecisionLike;
  acosh: (value: FixedPrecisionValue) => FixedPrecisionLike;
  acot: (value: FixedPrecisionValue) => FixedPrecisionLike;
  acoth: (value: FixedPrecisionValue) => FixedPrecisionLike;
  acsc: (value: FixedPrecisionValue) => FixedPrecisionLike;
  acsch: (value: FixedPrecisionValue) => FixedPrecisionLike;
  asec: (value: FixedPrecisionValue) => FixedPrecisionLike;
  asech: (value: FixedPrecisionValue) => FixedPrecisionLike;
  asin: (value: FixedPrecisionValue) => FixedPrecisionLike;
  asinh: (value: FixedPrecisionValue) => FixedPrecisionLike;
  atan: (value: FixedPrecisionValue) => FixedPrecisionLike;
  atanh: (value: FixedPrecisionValue) => FixedPrecisionLike;
};

const registry: Partial<FunctionTable> = Object.create(null);

let defaultContext: FPContext = makeContext(8, 4);

export function getDefaultContext(): FPContext {
  return defaultContext;
}

export function configureDefaultContext(config: FixedPrecisionConfig): void {
  defaultContext = configureContext(config, defaultContext);
}

export function registerFunction<K extends keyof FunctionTable>(
  name: K,
  fn: FunctionTable[K],
): void {
  registry[name] = fn;
}

export function getFunction<K extends keyof FunctionTable>(
  name: K,
): FunctionTable[K] {
  const fn = registry[name];
  if (fn === undefined) {
    throw new Error(
      `FixedPrecision function "${name}" is not available: import it from "fixed-precision/${name}"`,
    );
  }
  return fn;
}

export function isFixedPrecisionLike(
  value: unknown,
): value is FixedPrecisionLike {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as FixedPrecisionLike)[FP_BRAND] === true
  );
}

export function construct(
  value: FixedPrecisionValue,
  ctx?: FPContext,
): FixedPrecisionLike {
  return new FixedPrecision(value, ctx);
}

export function fromRawWithContext(
  rawValue: bigint,
  ctx: FPContext,
): FixedPrecisionLike {
  return FixedPrecision.fromRawWithContext(rawValue, ctx);
}

export function fromContextValue(
  value: FixedPrecisionValue,
  operation: (value: bigint, ctx: FPContext) => bigint,
): FixedPrecisionLike {
  const ctx = resolveContext([value]);
  return fromRawWithContext(operation(toScaled(value, ctx), ctx), ctx);
}

export function toScaled(value: FixedPrecisionValue, ctx: FPContext): bigint {
  if (isFixedPrecisionLike(value)) {
    if (value.context().places === ctx.places) return value.raw();
    return scale_value(
      value.raw(),
      ctx.places,
      ctx.roundingMode,
      value.context(),
    );
  }
  if (typeof value === "bigint") return value;
  if (typeof value === "number") return from_number_with_ctx(value, ctx);
  if (typeof value === "string") return from_string_with_ctx(value, ctx);
  throw new Error(`Invalid value type: ${typeof value}`);
}

export function resolveContext(values: FixedPrecisionValue[]): FPContext {
  let best: FPContext | null = null;
  for (const v of values) {
    if (isFixedPrecisionLike(v)) {
      if (!best || v.context().places > best.places) {
        best = v.context();
        if (best.places === 20) return best;
      }
    }
  }
  return best ?? defaultContext;
}

export function normalizeTo(
  v: FixedPrecisionValue,
  ctx: FPContext,
): FixedPrecisionLike {
  if (isFixedPrecisionLike(v)) {
    const vCtx = v.context();
    if (vCtx.places === ctx.places && vCtx.roundingMode === ctx.roundingMode) {
      return v;
    }
    return v.scale(ctx.places, ctx.roundingMode);
  }
  return new FixedPrecision(v, ctx);
}
