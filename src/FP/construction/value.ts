import { scale_value } from "../../core/arithmetic/scale";
import { from_number_with_ctx } from "../../core/numeric/fromNumber";
import { from_string_with_ctx } from "../../core/string/fromString";
import { makeContext } from "./context";
import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
  FPContext,
} from "./types";

const DEFAULT_CONTEXT: FPContext = Object.freeze(makeContext(8, 4));

export function getDefaultContext(): FPContext {
  return DEFAULT_CONTEXT;
}

export function isFixedPrecisionData(
  value: unknown,
): value is FixedPrecisionData {
  if (typeof value !== "object" || value === null) return false;
  const data = value as Partial<FixedPrecisionData>;
  if (typeof data.value !== "bigint") return false;
  const places = data.places;
  if (
    typeof places !== "number" ||
    !Number.isInteger(places) ||
    places < 0 ||
    places > 20
  ) {
    return false;
  }
  const roundingMode = data.roundingMode;
  if (
    typeof roundingMode !== "number" ||
    !Number.isInteger(roundingMode) ||
    roundingMode < 0 ||
    roundingMode > 8
  ) {
    return false;
  }
  return typeof data.SCALE === "bigint" && typeof data.SCALENUMBER === "number";
}

export function fromRawWithContext(
  rawValue: bigint,
  ctx: FPContext,
): FixedPrecisionData {
  return {
    places: ctx.places,
    roundingMode: ctx.roundingMode,
    SCALE: ctx.SCALE,
    SCALENUMBER: ctx.SCALENUMBER,
    value: rawValue,
  };
}

export function construct(
  value: FixedPrecisionOperand,
  ctx?: FPContext,
): FixedPrecisionData {
  const target = ctx ?? getDefaultContext();
  return fromRawWithContext(toScaled(value, target), target);
}

export function fromContextValue(
  value: FixedPrecisionOperand,
  operation: (value: bigint, ctx: FPContext) => bigint,
): FixedPrecisionData {
  if (isFixedPrecisionData(value)) {
    return fromRawWithContext(operation(value.value, value), value);
  }
  const ctx = getDefaultContext();
  return fromRawWithContext(operation(toScaled(value, ctx), ctx), ctx);
}

export function toScaled(value: FixedPrecisionOperand, ctx: FPContext): bigint {
  if (isFixedPrecisionData(value)) {
    if (value.places === ctx.places) return value.value;
    return scale_value(value.value, ctx.places, ctx.roundingMode, value);
  }
  if (typeof value === "bigint") return value;
  if (typeof value === "number") return from_number_with_ctx(value, ctx);
  if (typeof value === "string") return from_string_with_ctx(value, ctx);
  throw new Error(`Invalid value type: ${typeof value}`);
}

export function resolveContext(values: FixedPrecisionOperand[]): FPContext {
  let best: FPContext | null = null;
  for (const v of values) {
    if (isFixedPrecisionData(v)) {
      if (!best || v.places > best.places) {
        best = v;
        if (best.places === 20) return best;
      }
    }
  }
  return best ?? DEFAULT_CONTEXT;
}

export function resolveContextSingle(value: FixedPrecisionOperand): FPContext {
  return isFixedPrecisionData(value) ? value : DEFAULT_CONTEXT;
}

export function resolveContextPair(
  a: FixedPrecisionOperand,
  b: FixedPrecisionOperand,
): FPContext {
  if (isFixedPrecisionData(a)) {
    if (isFixedPrecisionData(b)) {
      return a.places >= b.places ? a : b;
    }
    return a;
  }
  return isFixedPrecisionData(b) ? b : DEFAULT_CONTEXT;
}

function bestOfList(
  best: FPContext | null,
  list: readonly FixedPrecisionOperand[],
): FPContext | null {
  for (let i = 0; i < list.length; i++) {
    const v = list[i];
    if (isFixedPrecisionData(v) && (!best || v.places > best.places)) {
      best = v;
      if (best.places === 20) return best;
    }
  }
  return best;
}

export function resolveContextArrays(
  a: readonly FixedPrecisionOperand[],
  b: readonly FixedPrecisionOperand[],
): FPContext {
  const best = bestOfList(bestOfList(null, a), b);
  return best ?? DEFAULT_CONTEXT;
}

export function toSingleScaled(value: FixedPrecisionOperand): bigint {
  return isFixedPrecisionData(value)
    ? value.value
    : toScaled(value, DEFAULT_CONTEXT);
}

export function normalizeTo(
  v: FixedPrecisionOperand,
  ctx: FPContext,
): FixedPrecisionData {
  if (isFixedPrecisionData(v)) {
    if (v.places === ctx.places && v.roundingMode === ctx.roundingMode) {
      return v;
    }
    return fromRawWithContext(
      scale_value(v.value, ctx.places, ctx.roundingMode, v),
      ctx,
    );
  }
  return construct(v, ctx);
}
