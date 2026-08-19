import { log_value } from "./arithmetic/log";
import {
  fromRawWithContext,
  registerFunction,
  resolveContext,
  toScaled,
} from "./core/value";
import { naturalLog } from "./naturalLog";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function log(
  value: FixedPrecisionValue,
  base?: FixedPrecisionValue,
): FixedPrecisionLike {
  if (base === undefined) {
    return naturalLog(value);
  }

  const ctx = resolveContext([value, base]);
  return fromRawWithContext(
    log_value(toScaled(value, ctx), toScaled(base, ctx), ctx),
    ctx,
  );
}

registerFunction("log", log);
