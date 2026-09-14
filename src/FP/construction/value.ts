import { scale_value } from "../../core/arithmetic/scale";
import { MAX_PLACES, preferContext } from "../../core/construction/context";
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
  // Single ctx load: the previous version reloaded data.ctx on every check.
  const ctx = data.ctx;
  if (ctx === undefined || ctx === null) return false;
  const places = ctx.places;
  if (
    typeof places !== "number" ||
    !Number.isInteger(places) ||
    places < 0 ||
    places > 20
  ) {
    return false;
  }
  const roundingMode = ctx.roundingMode;
  if (
    typeof roundingMode !== "number" ||
    !Number.isInteger(roundingMode) ||
    roundingMode < 0 ||
    roundingMode > 8
  ) {
    return false;
  }
  return typeof ctx.SCALE === "bigint" && typeof ctx.SCALENUMBER === "number";
}

export function fromRawWithContext(
  rawValue: bigint,
  ctx: FPContext,
): FixedPrecisionData {
  return {
    ctx,
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
    return fromRawWithContext(operation(value.value, value.ctx), value.ctx);
  }
  const ctx = getDefaultContext();
  return fromRawWithContext(operation(toScaled(value, ctx), ctx), ctx);
}

/**
 * Scales already-validated fixed-precision data into a target context.
 *
 * Skips validation: callers must have confirmed the shape with
 * isFixedPrecisionData first.
 *
 * @param value - Validated fixed-precision data.
 * @param ctx - Target context.
 * @returns Raw scaled value.
 */
export function toScaledData(
  value: FixedPrecisionData,
  ctx: FPContext,
): bigint {
  if (value.ctx.places === ctx.places) return value.value;
  return scale_value(value.value, ctx.places, ctx.roundingMode, value.ctx);
}

export function toScaled(value: FixedPrecisionOperand, ctx: FPContext): bigint {
  if (isFixedPrecisionData(value)) return toScaledData(value, ctx);
  if (typeof value === "bigint") return value;
  if (typeof value === "number") return from_number_with_ctx(value, ctx);
  if (typeof value === "string") return from_string_with_ctx(value, ctx);
  throw new Error(`Invalid value type: ${typeof value}`);
}

/**
 * Resolves the pair context and scales both operands with a single
 * validation per operand.
 *
 * Equivalent to combining resolveContextPair with one toScaled call per
 * operand, without validating either operand twice.
 *
 * @param a - Left operand, data or primitive.
 * @param b - Right operand, data or primitive.
 * @returns Resolved context with both raw scaled values.
 */
export function toScaledPair(
  a: FixedPrecisionOperand,
  b: FixedPrecisionOperand,
): { ctx: FPContext; left: bigint; right: bigint } {
  if (isFixedPrecisionData(a)) {
    if (isFixedPrecisionData(b)) {
      const ctx = preferContext(a.ctx, b.ctx);
      return { ctx, left: toScaledData(a, ctx), right: toScaledData(b, ctx) };
    } else {
      return {
        ctx: a.ctx,
        left: a.value,
        right: toScaled(b, a.ctx),
      };
    }
  } else {
    if (isFixedPrecisionData(b)) {
      return {
        ctx: b.ctx,
        left: toScaled(a, b.ctx),
        right: b.value,
      };
    } else {
      return {
        ctx: DEFAULT_CONTEXT,
        left: toScaled(a, DEFAULT_CONTEXT),
        right: toScaled(b, DEFAULT_CONTEXT),
      };
    }
  }
}

/**
 * Raw pair scaling, left-biased.
 *
 * Trusts the context of the leftmost fixed-precision operand instead of
 * resolving the pair: data pairs are combined as-is with no compatibility
 * check and no rescaling, so callers must pass compatible contexts. Only
 * primitive sides are scaled. Falls back to the default context when both
 * operands are primitives.
 *
 * @param a - Left operand, data or primitive.
 * @param b - Right operand, data or primitive.
 * @returns Left context with both raw values.
 */
export function toScaledPairRaw(
  a: FixedPrecisionOperand,
  b: FixedPrecisionOperand,
): { ctx: FPContext; left: bigint; right: bigint } {
  if (isFixedPrecisionData(a)) {
    if (isFixedPrecisionData(b)) {
      // Compatible contexts by contract, combine raw values directly.
      return { ctx: a.ctx, left: a.value, right: b.value };
    } else {
      // Only the primitive side needs scaling into the left context.
      if (typeof b === "bigint") {
        return { ctx: a.ctx, left: a.value, right: b };
      } else {
        return { ctx: a.ctx, left: a.value, right: toScaled(b, a.ctx) };
      }
    }
  } else {
    if (isFixedPrecisionData(b)) {
      // Only the primitive side needs scaling into the right context.
      if (typeof a === "bigint") {
        return { ctx: b.ctx, left: a, right: b.value };
      } else {
        return { ctx: b.ctx, left: toScaled(a, b.ctx), right: b.value };
      }
    } else {
      return {
        ctx: DEFAULT_CONTEXT,
        left: toScaled(a, DEFAULT_CONTEXT),
        right: toScaled(b, DEFAULT_CONTEXT),
      };
    }
  }
}

export function resolveContext(values: FixedPrecisionOperand[]): FPContext {
  let best: FPContext | null = null;
  for (const v of values) {
    if (isFixedPrecisionData(v)) {
      best = preferContext(best, v.ctx);
      if (best.places === MAX_PLACES) return best;
    }
  }
  return best ?? DEFAULT_CONTEXT;
}

export function resolveContextSingle(value: FixedPrecisionOperand): FPContext {
  return isFixedPrecisionData(value) ? value.ctx : DEFAULT_CONTEXT;
}

export function resolveContextPair(
  a: FixedPrecisionOperand,
  b: FixedPrecisionOperand,
): FPContext {
  if (isFixedPrecisionData(a)) {
    if (isFixedPrecisionData(b)) {
      return preferContext(a.ctx, b.ctx);
    } else {
      return a.ctx;
    }
  } else {
    return isFixedPrecisionData(b) ? b.ctx : DEFAULT_CONTEXT;
  }
}

function bestOfList(
  best: FPContext | null,
  list: readonly FixedPrecisionOperand[],
): FPContext | null {
  for (let i = 0; i < list.length; i++) {
    const v = list[i];
    if (isFixedPrecisionData(v)) {
      best = preferContext(best, v.ctx);
      if (best.places === MAX_PLACES) return best;
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
    if (
      v.ctx.places === ctx.places &&
      v.ctx.roundingMode === ctx.roundingMode
    ) {
      return v;
    }
    return fromRawWithContext(
      scale_value(v.value, ctx.places, ctx.roundingMode, v.ctx),
      ctx,
    );
  }
  return construct(v, ctx);
}
