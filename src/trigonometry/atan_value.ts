import type { FPContext } from "../FixedPrecision";
import { atan_work } from "./internal/atan_work";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { get_work_context } from "./internal/work_context";

export function atan_value(value: bigint, ctx: FPContext): bigint {
  const work = get_work_context(ctx);
  return from_work_scale(atan_work(to_work_scale(value), work));
}
