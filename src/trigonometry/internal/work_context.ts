import type { FPContext } from "../../FixedPrecision";
import { get_guard_scale, get_max_iterations, PI } from "./constants";
import { scaled_decimal } from "./scaled_decimal";

let work_context_cache: Map<bigint, Work_Context> | undefined;

export type Work_Context = {
  scale: bigint;
  guard_scale: bigint;
  max_iterations: number;
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
  const guard_scale = get_guard_scale(ctx.places);
  const max_iterations = get_max_iterations(ctx.places);
  const scale = ctx.SCALE * guard_scale;
  const pi = scaled_decimal(PI, scale);

  return {
    scale,
    guard_scale,
    max_iterations,
    pi,
    half_pi: pi >> 1n,
    two_pi: pi << 1n,
  };
}
