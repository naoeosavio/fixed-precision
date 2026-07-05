import type { FPContext } from "../FixedPrecision";
import { clamp_unit } from "./internal/clamp_unit";
import { PI } from "./internal/constants";
import { reciprocal_work } from "./internal/reciprocal_work";
import { reduce_angle } from "./internal/reduce_angle";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { sin_work } from "./internal/sin_series";
import { get_work_context } from "./internal/work_context";

export function csc_value(value: bigint, ctx: FPContext): bigint {
  const pi_original = BigInt(PI.slice(0, ctx.places + 1));

  if (value % pi_original === 0n) {
    throw new Error("Cosecant is undefined when sine is zero");
  }

  const work = get_work_context(ctx);
  const reduced = reduce_angle(to_work_scale(value, work.guard_scale), work);
  const sine = clamp_unit(
    sin_work(reduced.angle, work.scale, work.max_iterations),
    work.scale,
  );
  return from_work_scale(
    reciprocal_work(sine, work.scale, "Cosecant"),
    work.guard_scale,
  );
}
