import { divide_rounded } from "./divide_rounded";
import { exp_reduced_work } from "./exp_reduced_work";
import { MAX_SERIES_ITERATIONS } from "./ln_constants";
import type { Work_Context } from "./work_context";

function max_iterations(scale: bigint): bigint {
  const digits = BigInt(scale.toString().length);
  const needed = (digits * 11n) / 5n;
  return needed > MAX_SERIES_ITERATIONS ? needed : MAX_SERIES_ITERATIONS;
}

export function exp_work(value: bigint, work: Work_Context): bigint {
  const exponent = divide_rounded(value, work.ln2);
  const reduced = value - exponent * work.ln2;

  const abs_reduced = reduced < 0n ? -reduced : reduced;
  if (abs_reduced > work.ln2) {
    throw new Error("exp argument reduction failed: |x| >= ln2");
  }

  let result = exp_reduced_work(
    reduced,
    work.scale,
    max_iterations(work.scale),
  );

  if (exponent > 0n) {
    result <<= exponent;
  } else if (exponent < 0n) {
    result >>= -exponent;
  }

  return result;
}
