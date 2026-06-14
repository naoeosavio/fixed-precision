import { divide_rounded } from "./divide_rounded";
import { exp_reduced_work } from "./exp_reduced_work";
import type { Work_Context } from "./work_context";

export function exp_work(value: bigint, work: Work_Context): bigint {
  const exponent = divide_rounded(value, work.ln2);
  const reduced = value - exponent * work.ln2;
  let result = exp_reduced_work(reduced, work.scale);

  if (exponent > 0n) {
    result <<= exponent;
  } else if (exponent < 0n) {
    result >>= -exponent;
  }

  return result;
}
