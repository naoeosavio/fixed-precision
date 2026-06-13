import type { FPContext } from "../FixedPrecision";
import { exp_work } from "./internal/exp_work";
import { from_work_scale, to_work_scale } from "./internal/scale_utils";
import { get_work_context } from "./internal/work_context";

export function exp_value(value: bigint, ctx: FPContext): bigint {
  const work = get_work_context(ctx);
  return from_work_scale(exp_work(to_work_scale(value), work));
}
