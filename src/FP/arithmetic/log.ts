import { log_value } from "../../core/arithmetic/log";
import {
  type BaseOptions,
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../construction";
import { naturalLog } from "./naturalLog";

export function log(
  value: FixedPrecisionOperand,
  options?: BaseOptions,
): FixedPrecisionData {
  const base = options?.base;

  if (base === undefined) {
    return naturalLog(value);
  }

  const ctx = resolveContext([value, base]);
  return fromRawWithContext(
    log_value(toScaled(value, ctx), toScaled(base, ctx), ctx),
    ctx,
  );
}
