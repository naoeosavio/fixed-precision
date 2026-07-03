import type { FPContext } from "../FixedPrecision";
import { clamp_unit } from "./internal/clamp_unit";
import { reduce_angle } from "./internal/reduce_angle";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { sin_work } from "./internal/sin_series";
import { get_work_context } from "./internal/work_context";

function snap_to_close_candidate(angle: bigint, work: ReturnType<typeof get_work_context>): bigint {
  const tolerance = work.guard_scale * 2n;
  const pi_12 = work.pi / 12n;
  const candidates: bigint[] = [
    0n,
    pi_12,
    pi_12 * 2n,
    pi_12 * 3n,
    pi_12 * 4n,
    pi_12 * 5n,
    work.half_pi,
  ];

  for (const candidate of candidates) {
    const diff = angle > candidate ? angle - candidate : candidate - angle;
    if (diff < tolerance) {
      return candidate;
    }
  }

  return angle;
}

export function sin_value(value: bigint, ctx: FPContext): bigint {
  const work = get_work_context(ctx);
  const reduced = reduce_angle(to_work_scale(value, work.guard_scale), work);
  const abs_angle = reduced.angle >= 0n ? reduced.angle : -reduced.angle;
  const snapped = snap_to_close_candidate(abs_angle, work);
  const angle = reduced.angle >= 0n ? snapped : -snapped;
  return from_work_scale(
    clamp_unit(
      sin_work(angle, work.scale, work.max_iterations),
      work.scale,
    ),
    work.guard_scale,
  );
}
