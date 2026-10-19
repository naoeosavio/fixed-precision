import { natural_log_one_to_two } from "./natural_log_one_to_two";
import type { Work_Context } from "./work_context";

export function natural_log_work(value: bigint, work: Work_Context): bigint {
  let normalized = value;
  let exponent = 0n;

  while (normalized >= work.upper_bound) {
    normalized >>= 1n;
    exponent += 1n;
  }

  while (normalized < work.scale) {
    normalized <<= 1n;
    exponent -= 1n;
  }

  return exponent * work.ln2 + natural_log_one_to_two(normalized, work.scale);
}
