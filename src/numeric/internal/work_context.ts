import type { FPContext } from "../../FixedPrecision";
import { GUARD_SCALE, LN2, LN10 } from "./ln_constants";
import { scaled_decimal } from "./scaled_decimal";

let work_context_cache: Map<bigint, Work_Context> | undefined;

export type Work_Context = {
  scale: bigint;
  upper_bound: bigint;
  ln2: bigint;
  ln10: bigint;
};

export function get_work_context(ctx: FPContext): Work_Context {
  if (work_context_cache === undefined) {
    work_context_cache = new Map<bigint, Work_Context>();
  }
  const existing = work_context_cache.get(ctx.SCALE);
  if (existing !== undefined) {
    return existing;
  }
  const work = make_work_context(ctx);
  work_context_cache.set(ctx.SCALE, work);
  return work;
}

function make_work_context(ctx: FPContext): Work_Context {
  const scale = ctx.SCALE * GUARD_SCALE;
  return {
    scale,
    upper_bound: scale << 1n,
    ln2: scaled_decimal(LN2, scale),
    ln10: scaled_decimal(LN10, scale),
  };
}
