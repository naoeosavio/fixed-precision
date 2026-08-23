import { log_value } from "../../core/arithmetic/log";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../construction";
import { naturalLog } from "./naturalLog";

export function log(
  value: FixedPrecisionOperand,
  base?: FixedPrecisionOperand,
): FixedPrecisionData {
  if (base === undefined) {
    return naturalLog(value);
  }

  const ctx = resolveContext([value, base]);
  return fromRawWithContext(
    log_value(toScaled(value, ctx), toScaled(base, ctx), ctx),
    ctx,
  );
}
