import type { FPContext } from "../FixedPrecision";
import { atan_reduced_work } from "./internal/atan_reduced_work";
import { to_work_scale } from "./internal/scale_utils";
import { get_work_context } from "./internal/work_context";

export function atan_value(value: bigint, ctx: FPContext): bigint {
  const work = get_work_context(ctx);

  if (value === 0n) {
    return 0n;
  }

  const sign = value < 0n ? -1n : 1n;
  const abs_value = value < 0n ? -value : value;

  const work_tangent = to_work_scale(abs_value, work.guard_scale);

  const use_inverse = work_tangent > work.scale;
  const reduced_input = use_inverse
    ? (work.scale * work.scale + work_tangent / 2n) / work_tangent
    : work_tangent;

  const angle = atan_reduced_work(
    reduced_input,
    work.scale,
    work.max_iterations,
  );

  let result = use_inverse ? work.half_pi - angle : angle;
  result = sign * result;
  result /= work.guard_scale;

  return result;
}
