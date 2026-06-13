import type { FPContext } from "../FixedPrecision";
import { atan2_work } from "./internal/atan2_work";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { get_work_context } from "./internal/work_context";

export function atan2_value(y: bigint, x: bigint, ctx: FPContext): bigint {
  const work = get_work_context(ctx);
  return from_work_scale(atan2_work(to_work_scale(y), to_work_scale(x), work));
}
