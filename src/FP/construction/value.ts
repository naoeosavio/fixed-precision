import { scale_value } from "../../core/arithmetic/scale";
import { from_number_with_ctx } from "../../core/numeric/fromNumber";
import { from_string_with_ctx } from "../../core/string/fromString";
import { configureContext, makeContext } from "./context";
import type {
  FixedPrecisionConfig,
  FixedPrecisionData,
  FixedPrecisionOperand,
  FPContext,
} from "./types";

let defaultContext: FPContext = makeContext(8, 4);

export function getDefaultContext(): FPContext {
  return defaultContext;
}

export function configureDefaultContext(config: FixedPrecisionConfig): void {
  defaultContext = configureContext(config, defaultContext);
}

export function isFixedPrecisionData(
  value: unknown,
): value is FixedPrecisionData {
  if (typeof value !== "object" || value === null) return false;
  const data = value as Partial<FixedPrecisionData>;
  return (
    typeof data.value === "bigint" &&
    typeof data.places === "number" &&
    Number.isInteger(data.places) &&
    data.places >= 0 &&
    data.places <= 20 &&
    typeof data.roundingMode === "number" &&
    Number.isInteger(data.roundingMode) &&
    data.roundingMode >= 0 &&
    data.roundingMode <= 8 &&
    typeof data.SCALE === "bigint" &&
    typeof data.SCALENUMBER === "number"
  );
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
  const ctx = resolveContext([value]);
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
  return best ?? defaultContext;
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
