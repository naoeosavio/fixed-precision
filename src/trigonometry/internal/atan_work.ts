import { atan_reduced_work } from "./atan_reduced_work";
import type { Work_Context } from "./work_context";

export function atan_work(value: bigint, work: Work_Context): bigint {
  if (value === 0n) {
    return 0n;
  }

  const sign = value < 0n ? -1n : 1n;
  const absolute_value = value < 0n ? -value : value;
  const reduced =
    absolute_value > work.scale
      ? work.half_pi -
        atan_reduced_work(
          (work.scale * work.scale) / absolute_value,
          work.scale,
          work.max_iterations,
        )
      : atan_reduced_work(absolute_value, work.scale, work.max_iterations);

  return sign * reduced;
}
 