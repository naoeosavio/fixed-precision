import { FactoryContext } from "./core/context";
import { construct, registerFunction } from "./core/value";
import type {
  FixedPrecisionConfig,
  FixedPrecisionLike,
  FixedPrecisionValue,
} from "./types";

export function createFactory(
  config: FixedPrecisionConfig,
): (value: FixedPrecisionValue) => FixedPrecisionLike {
  const ctx = FactoryContext(config);
  return (value: FixedPrecisionValue) => construct(value, ctx);
}

registerFunction("createFactory", createFactory);
