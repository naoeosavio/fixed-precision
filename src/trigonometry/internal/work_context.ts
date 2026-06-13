import type { FPContext } from "../../FixedPrecision";
import { GUARD_SCALE, PI } from "./constants";
import { scaled_decimal } from "./scaled_decimal";

let work_context_cache: Map<bigint, Work_Context> | undefined;

export type Work_Context = {
  scale: bigint;
  pi: bigint;
  half_pi: bigint;
  two_pi: bigint;
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
  const pi = scaled_decimal(PI, scale);

  return {
    scale,
    pi,
    half_pi: pi >> 1n,
    two_pi: pi << 1n,
  };
}
