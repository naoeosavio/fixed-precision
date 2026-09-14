import { log_value } from "../../core/arithmetic/log";
import {
  type BaseOptions,
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  toScaledPair,
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

  const scaled = toScaledPair(value, base);
  return fromRawWithContext(
    log_value(scaled.left, scaled.right, scaled.ctx),
    scaled.ctx,
  );
}
