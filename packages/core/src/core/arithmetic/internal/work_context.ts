import type { FPContext } from "../../construction/types";
import { GUARD_SCALE, LN2, LN10 } from "./ln_constants";
import { scaled_decimal } from "./scaled_decimal";

let work_context_cache: Map<bigint, Work_Context> | undefined;

export type Work_Context = {
  scale: bigint;
  upper_bound: bigint;
  ln2: bigint;
  ln10: bigint;
};

export function get_work_context(
  ctx: FPContext,
  guard: bigint = GUARD_SCALE,
): Work_Context {
  if (work_context_cache === undefined) {
    work_context_cache = new Map<bigint, Work_Context>();
  }
  const key = ctx.SCALE * guard;
  const existing = work_context_cache.get(key);
  if (existing !== undefined) {
    return existing;
  }
  const work = make_work_context(ctx, guard);
  work_context_cache.set(key, work);
  return work;
}

function make_work_context(ctx: FPContext, guard: bigint): Work_Context {
  const scale = ctx.SCALE * guard;
  return {
    scale,
    upper_bound: scale << 1n,
    ln2: scaled_decimal(LN2, scale),
    ln10: scaled_decimal(LN10, scale),
  };
}
