import { atan_work } from "./atan_work";
import type { Work_Context } from "./work_context";

export function atan2_work(y: bigint, x: bigint, work: Work_Context): bigint {
  if (x > 0n) {
    return atan_work((y * work.scale) / x, work);
  }

  if (x < 0n) {
    const angle = atan_work((y * work.scale) / x, work);
    return y >= 0n ? angle + work.pi : angle - work.pi;
  }

  if (y > 0n) {
    return work.half_pi;
  }

  if (y < 0n) {
    return -work.half_pi;
  }

  return 0n;
}
